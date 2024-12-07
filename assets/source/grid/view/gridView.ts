import {_decorator, Component, Node, Layout, Vec2, Vec3, Tween, UITransform, Size, Prefab, instantiate, EventTarget, tween} from "cc";
import {Pool} from "db://assets/utils/pool";
import {TileView} from "db://assets/source/grid/view/tileView";
import {TileSlotView} from "db://assets/source/grid/view/tileSlotView";
import {Grid} from "db://assets/source/grid/grid";
const {ccclass, property, requireComponent} = _decorator;


@ccclass('grid-view')
@requireComponent(UITransform)
@requireComponent(Layout)
export class GridView extends Component{
    private transform: UITransform;
    private layout: Layout;
    
    private _grid: Grid;
    private _initialized: boolean = false;
    
    private _tileSlotViewsPool: Pool<TileSlotView>;
    private _tileViewsPool: Pool<TileView>;
    private _tilesSpawnSlot: TileSlotView;
    
    private _tileSlotViews: TileSlotView[][] = [];
    
    public get tileSlotViews() {
        return this._tileSlotViews;
    }
    
    protected onLoad() {
        this.transform = this.node.getComponent(UITransform);
        this.layout = this.node.getComponent(Layout);
    }
    
    public init(tileSlotViewsPool: Pool<TileSlotView>, tileViewsPool: Pool<TileView>, tilesSpawnSlot: TileSlotView) {
        this._tileSlotViewsPool = tileSlotViewsPool;
        this._tileViewsPool = tileViewsPool;
        this._tilesSpawnSlot = tilesSpawnSlot;
    }
    
    public initGrid(grid: Grid) {
        if (this._initialized) {
            return;
        }
        this._grid = grid;
        
        const spacing = new Vec2(this.layout.spacingX * this._grid.size.x, this.layout.spacingY * this._grid.size.y);

        const isXLong = this._grid.size.x > this._grid.size.y;
        const cellSize = Math.floor(isXLong 
            ? (this.transform.contentSize.x - spacing.x) / this._grid.size.x
            : (this.transform.contentSize.y - spacing.y) / this._grid.size.y
        );
        
        const contentSize = new Vec2(spacing.x + (cellSize * this._grid.size.x), spacing.y + (cellSize * this._grid.size.y));
        const padding = new Vec2(
            (this.transform.contentSize.x - contentSize.x) / 2, 
            (this.transform.contentSize.y - contentSize.y) / 2
        );
        
        const cellContentSize = new Size(cellSize, cellSize);
        this.layout.cellSize = cellContentSize;
        this._tilesSpawnSlot.transform.contentSize = cellContentSize;
        
        this.layout.paddingLeft = padding.x;
        this.layout.paddingRight = padding.x;
        this.layout.paddingTop = padding.y;
        this.layout.paddingBottom = padding.y;

        for (const column of this._grid.tiles) {
            this._tileSlotViews.push([])
            for (const tile of column) {
                const tileView = this._tileViewsPool.get();
                tileView.setTile(tile)
                
                const tileSlotView = this._tileSlotViewsPool.get();
                this.layout.node.addChild(tileSlotView.node);
                tileSlotView.init(tile.position);
                tileSlotView.setTileView(tileView);
                
                this._tileSlotViews[tile.position.x].push(tileSlotView);
            }
        }
        
        
        this._initialized = true;
    }
}