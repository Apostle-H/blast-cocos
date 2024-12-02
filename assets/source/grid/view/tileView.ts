import {Component, Sprite, Vec2, _decorator, EventTarget, Node} from "cc";
import {ITileView} from "db://assets/source/grid/view/iTileView";
import {TILES_COLORS_CONFIG} from "db://assets/source/grid/view/data/tilesColorsConfig";
const {ccclass, property} = _decorator;

export const TILE_CLICK_ET = new EventTarget();

@ccclass('tile-view')
export class TileView extends Component implements ITileView {
    @property({ type: Sprite })
    private sprite: Sprite;
    
    private _position: Vec2;
    
    protected onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }
    
    protected onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.click, this);
    }

    public move(position: Vec2) {
        this._position = position;
    }
    
    public paint(color: number) {
        this.sprite.spriteFrame = TILES_COLORS_CONFIG.get(color);
    }
    
    public clear() {
        
    }
    
    private click() {
        TILE_CLICK_ET.emit(true.toString(), this._position);
    }
}