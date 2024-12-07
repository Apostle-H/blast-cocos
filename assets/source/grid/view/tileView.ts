import {Component, Sprite, Vec3, _decorator, EventTarget, Node, tween} from "cc";
import {TILES_COLORS_CONFIG} from "db://assets/source/grid/view/data/tilesColorsConfig";
import {Tile} from "db://assets/source/grid/tile";
const {ccclass, property} = _decorator;

export const TILE_CLICK_ET = new EventTarget();

@ccclass('tile-view')
export class TileView extends Component {
    @property({ type: Sprite })
    private sprite: Sprite;
    @property
    private scaleTime: number = 0.2;
    
    private _tile: Tile;
    
    private _clearTween = tween(this.node).to(this.scaleTime, { scale: Vec3.ZERO });
    
    public get tile() {
        return this._tile;
    }
    
    protected onLoad() {
        this._clearTween.target(this.sprite.node);
    }
    
    protected onEnable() {
        this.sprite.node.scale = Vec3.ONE;
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }
    
    protected onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.click, this);
    }

    public clear() {
        return new Promise<void>((resolve) => {
            this._clearTween.clone().call(() => resolve()).start(0);
            this._tile = null;
        })
    }
    
    public setTile(tile: Tile) {
        this._tile = tile;
        
        this.sprite.spriteFrame = TILES_COLORS_CONFIG.get(this._tile.color);
    }
    
    private click() {
        TILE_CLICK_ET.emit(0, this);
    }
}