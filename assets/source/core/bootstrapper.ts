import {_decorator, Component, EventTarget, JsonAsset, Vec2, Prefab, instantiate} from "cc";
import {TILES_COLORS_CONFIG} from "db://assets/source/grid/view/data/tilesColorsConfig";
import {GridView} from "db://assets/source/grid/view/gridView";
import {Grid} from "db://assets/source/grid/grid";
import {Clearer} from "db://assets/source/grid/clearer";
import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CoreStateMachine} from "db://assets/source/core/statemachine/stateMachine";
import {Pool} from "db://assets/utils/pool";
import {Tile} from "db://assets/source/grid/tile";
import {Filler} from "db://assets/source/grid/filler";
import {randomInteger} from "db://assets/utils/random";
import {Shuffler} from "db://assets/source/grid/shuffler";
import {TileSelector} from "db://assets/source/grid/tileSelector";
import {GridEventsInterpreter} from "db://assets/source/grid/view/updater/gridEventsInterpreter";
import {GridViewUpdater} from "db://assets/source/grid/view/updater/gridViewUpdater";
import {IStateMachine, StateResolver} from "db://assets/utils/stateMachine";
import {IdleStateResolver} from "db://assets/source/core/statemachine/stateResolvers/idleStateResolver";
import {ClearStateResolver} from "db://assets/source/core/statemachine/stateResolvers/clearStateResolver";
import {FillStateResolver} from "db://assets/source/core/statemachine/stateResolvers/fillStateResolver";
import {ShuffleStateResolver} from "db://assets/source/core/statemachine/stateResolvers/shuffleStateResolver";
import {TileClickInterpreter} from "db://assets/source/grid/input/tileClickInterpreter";
import {GRIDVIEW_CLEARED_ET} from "db://assets/source/grid/view/updater/commands/clearCommand";
import {GRIDVIEW_FILLED_ET} from "db://assets/source/grid/view/updater/commands/fillCommand";
import {GRIDVIEW_SHUFFLED_ET} from "db://assets/source/grid/view/updater/commands/shuffleCommand";
import {TileSlotView} from "db://assets/source/grid/view/tileSlotView";
import {TileView} from "db://assets/source/grid/view/tileView";
import {ViewClearer} from "db://assets/source/grid/view/viewClearer";
import {ViewFiller} from "db://assets/source/grid/view/viewFiller";
import {ViewShuffler} from "db://assets/source/grid/view/viewShuffler";
import {Score} from "db://assets/source/scoring/score";
import {ClearScorer} from "db://assets/source/grid/clearScorer";

const {ccclass, property} = _decorator;

export const GAME_READY_ET = new EventTarget();

@ccclass("bootstrapper")
export class Bootstrapper extends Component {
    @property({ type: JsonAsset })
    private tileSpritesJson: JsonAsset;
    
    @property
    private gridSize: Vec2;
    @property
    private gridMinBlastSize: number = 2;
    @property
    private gridTilesColorVariantsCount: number = 5;
    @property
    private maxShufflesPerIterationCount: number = 3;
    
    @property({ type: GridView })
    private gridView: GridView;
    @property({ type: TileSlotView })
    private tilesSpawnSlot: TileSlotView;
    @property({ type: Prefab })
    private tileSlotViewPrefab: Prefab;
    @property({ type: Prefab})
    private tileViewPrefab: Prefab;
    @property
    private fallShiftTime: number = 0.5;
    @property
    private shuffleShiftTime: number = 0.1;
    
    private _stateMachine: IStateMachine<CoreState>;
    private _stateResolvers: StateResolver<CoreState>[] = [];
    
    private _clearScorer: ClearScorer; 
    
    private _tileClicksInterpreter: TileClickInterpreter;
    private _gridEventsInterpreter: GridEventsInterpreter;
    
    
    protected start(): void {
        Promise.all([
            TILES_COLORS_CONFIG.load(this.tileSpritesJson)
        ]).then(() => {
            GAME_READY_ET.emit(0);
            
            this.init();
            this.bind();
            this.launch();
            
        }).catch((error) => {
            console.error(error);
            console.error("Failed to load the Game (Please check the console to resolve errors)");
            GAME_READY_ET.emit(1);
        });
    }
    
    protected onDestroy() {
        this.expose();
    }
    
    private init() {
        this._stateMachine = new CoreStateMachine(CoreState.IDLE);
        
        const score: Score = new Score();
        
        const tilesPool = new Pool(
            () => new Tile(), (tile) => tile.paint(randomInteger(1, this.gridTilesColorVariantsCount)), () => {}
        );
        const grid = new Grid(tilesPool, this.gridSize, this.gridMinBlastSize, this.gridTilesColorVariantsCount);
        const tileSelector = new TileSelector();
        const clearer = new Clearer(grid, tilesPool);
        const filler = new Filler(grid, tilesPool);
        const shuffler = new Shuffler(grid);
        
        this._clearScorer = new ClearScorer(score);
        
        const tileSlotViewsPool: Pool<TileSlotView> = new Pool(
            () => instantiate(this.tileSlotViewPrefab).getComponent(TileSlotView),
            (tileSlotView) => tileSlotView.node.active = true,
            (tileSlotView) => tileSlotView.node.active = false
        );

        const tileViewsPool: Pool<TileView> = new Pool(
            () => instantiate(this.tileViewPrefab).getComponent(TileView),
            (tileView) => tileView.node.active = true,
            (tileView) => tileView.node.active = false
        );
        
        this.gridView.init(tileSlotViewsPool, tileViewsPool, this.tilesSpawnSlot);
        this.gridView.initGrid(grid);
        this._tileClicksInterpreter = new TileClickInterpreter(tileSelector);
        
        const viewClearer = new ViewClearer(this.gridView, tileViewsPool); 
        const viewFiller = new ViewFiller(this.gridView, tileViewsPool, this.tilesSpawnSlot, this.fallShiftTime); 
        const viewShuffler = new ViewShuffler(this.gridView, this.shuffleShiftTime); 
        const gridViewUpdater = new GridViewUpdater();
        this._gridEventsInterpreter = new GridEventsInterpreter(viewClearer, viewFiller, viewShuffler, gridViewUpdater);
        
        this._stateResolvers.push(...[
            new IdleStateResolver(this._stateMachine),
            new ClearStateResolver(this._stateMachine, tileSelector, clearer, GRIDVIEW_CLEARED_ET),
            new FillStateResolver(this._stateMachine, filler, GRIDVIEW_FILLED_ET),
            new ShuffleStateResolver(this._stateMachine, shuffler, clearer, GRIDVIEW_SHUFFLED_ET, this.maxShufflesPerIterationCount)
        ]);
    }
    
    private bind() {
        this._stateResolvers.forEach(stateResolver => stateResolver.bind())
        this._clearScorer.bind();
        this._tileClicksInterpreter.bind();
        this._gridEventsInterpreter.bind();
    }
    
    private expose() {
        this._stateResolvers.forEach(stateResolver => stateResolver.expose());
        this._clearScorer.expose();
        this._tileClicksInterpreter.expose();
        this._gridEventsInterpreter.expose();
    }

    private launch() {
        this._stateMachine.start();
    }
}