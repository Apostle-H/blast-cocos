import {_decorator, Component, Layout, Vec2, UITransform, Size, Prefab, instantiate} from "cc";
import {IGridView} from "db://assets/source/grid/view/iGridView";
import {Tile} from "db://assets/source/grid/tile";
import {Pool} from "db://assets/utils/pool";
import {ITileView} from "db://assets/source/grid/view/iTileView";
import {TileView} from "db://assets/source/grid/view/tileView";
const { ccclass, property } = _decorator;


@ccclass('grid-view')
export class GridView extends Component implements IGridView {
    @property({ type: UITransform })
    private transform: UITransform;
    @property({ type: Layout })
    private layout: Layout;
    
    @property({ type: Prefab})
    private tileViewPrefab: Prefab;
    
    private _tileViewsPool: Pool<ITileView> = new Pool(
        () => { 
            const tileView = instantiate(this.tileViewPrefab).getComponent(TileView);
            this.layout.node.addChild(tileView.node);
            
            return tileView;
        }, 
        (tileView) => tileView.node.active = true,
        (tileView) => tileView.node.active = false
    );

    public resize(size: Vec2) {
        const spacing = new Vec2(this.layout.spacingX * size.x, this.layout.spacingY * size.y);

        const isXLong = size.x > size.y;
        const cellSize = Math.floor(isXLong 
            ? (this.transform.contentSize.x - spacing.x) / size.x
            : (this.transform.contentSize.y - spacing.y) / size.y
        );
        
        const contentSize = new Vec2(spacing.x + (cellSize * size.x), spacing.y + (cellSize * size.y));
        const padding = new Vec2(
            (this.transform.contentSize.x - contentSize.x) / 2, 
            (this.transform.contentSize.y - contentSize.y) / 2
        );
        
        this.layout.cellSize = new Size(cellSize, cellSize);
        
        console.log(cellSize);
        console.log(this.transform.contentSize);
        
        this.layout.paddingLeft = padding.x;
        this.layout.paddingRight = padding.x;
        this.layout.paddingTop = padding.y;
        this.layout.paddingBottom = padding.y;
    }
    
    public drawTile(tile: Tile) {
        const tileView = this._tileViewsPool.get();
        tile.setView(tileView);
    }
}