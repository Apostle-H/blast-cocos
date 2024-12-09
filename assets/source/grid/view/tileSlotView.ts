import {Component, Node, _decorator, Vec2, Vec3, Tween, tween, UITransform} from "cc";
import {TileView} from "db://assets/source/grid/view/tileView";
import {convertLocalToOtherLocal} from "db://assets/utils/convertation";
const {ccclass, requireComponent} = _decorator;

@ccclass("tile-slot-view")
@requireComponent(UITransform)
export class TileSlotView extends Component {
    private _transform: UITransform;
    
    private _position: Vec2 = Vec2.NEG_ONE;
    private _tileView: TileView;
    
    private _initialized: boolean = false;
    
    public get transform() {
        return this._transform;
    }
    
    public get position() {
        return this._position;
    }

    public get tileView() {
        return this._tileView;
    }
    
    protected onLoad() {
        this._transform = this.node.getComponent(UITransform);
    }
    
    public init(position: Vec2) {
        if (this._initialized) {
            return;
        }
        
        this._position = position;
        this._initialized = true;
    }
    
    public setTileView(tileView: TileView) {
        this._tileView = tileView;
        
        this.node.addChild(this._tileView.node);
        this._tileView.node.position = Vec3.ZERO;
    }
    
    public clear(): [Promise<void>, TileView] {
        const tileView = this._tileView;
        const clearPromise = this._tileView.clear()
        
        this._tileView = null;
        
        return [clearPromise, tileView];
    }
    
    public shiftTile(newSlot: TileSlotView, time: number) {
        const tween = this.tileShiftTween(newSlot, time);
        
        return new Promise<void>((resolve) => {
            tween.call(() => resolve()).start(0);
        });
    }

    private tileShiftTween(toSlot: TileSlotView, time: number): Tween<Node> {
        const targetTileView = this.tileView;
        const toLocalPos = convertLocalToOtherLocal(Vec3.ZERO, toSlot.transform, this.transform);
        if (this.position == Vec2.NEG_ONE) {
            const shiftFromPosition = new Vec3(toLocalPos.x, toSlot.position.y * this._transform.contentSize.y);
            targetTileView.node.setPosition(shiftFromPosition);
        }

        return tween(targetTileView.node)
            .to(time, { position: toLocalPos })
            .call(() => {
                toSlot.setTileView(targetTileView);
            });
    }
}