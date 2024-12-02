import {Component, _decorator, JsonAsset, EventTarget, Vec2} from "cc";
import {TILES_COLORS_CONFIG, TILES_COLORS_LOADED_ET} from "db://assets/source/grid/view/data/tilesColorsConfig";
import {GridView} from "db://assets/source/grid/view/gridView";
import {Grid} from "db://assets/source/grid/grid";
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
    @property({type: GridView})
    private gridView: GridView;
    
    private _grid: Grid;
    
    protected onLoad(): void {
        Promise.all([
            new Promise((resolve, reject) => {
                TILES_COLORS_LOADED_ET.once(true.toString(), resolve, this);
                TILES_COLORS_LOADED_ET.once(false.toString(), reject, this);
            })
        ]).then(() => {
            TILES_COLORS_LOADED_ET.removeAll(this);
            
            GAME_READY_ET.emit(true.toString());
            
            this._grid = new Grid(this.gridSize, this.gridMinBlastSize, this.gridTilesColorVariantsCount, this.gridView);
        }).catch((error) => {
            console.error(error);
            console.error("Failed to load the Game (Please check the console to resolve errors)");
            GAME_READY_ET.emit(false.toString());
        })
        
        TILES_COLORS_CONFIG.load(this.tileSpritesJson);
    }
}