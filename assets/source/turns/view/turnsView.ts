import {Component, _decorator, Label, Tween, tween, Vec3, Node} from "cc";
import {TURNS_DOWN_ET} from "db://assets/source/turns/turns";
const {ccclass, property} = _decorator;


@ccclass("turns-view")
export class TurnsView extends Component {
    @property
    private shrinkMultiplier: number = 0.7;
    @property
    private shrinkTime: number = 0.2;
    @property
    private growTime: number = 0.2;
    
    private _label: Label;

    private _downTween: Tween<Node>;
    
    private _initialized: boolean = false;
    
    protected onLoad() {
        this._label = this.node.getComponent(Label);

        this._downTween = tween(this.node)
            .to(this.shrinkTime, { scale: new Vec3(this.shrinkMultiplier, this.shrinkMultiplier, this.shrinkMultiplier) })
            .to(this.growTime, { scale: Vec3.ONE });
    }

    protected onEnable() {
        TURNS_DOWN_ET.on(0, this.turnsDown, this);
    }

    protected onDisable() {
        TURNS_DOWN_ET.off(0, this.turnsDown, this);
    }
    
    public init(left: number) {
        if (this._initialized) {
            return;
        }
        
        this._initialized = true;
        this.turnsDown(left);
    }

    private turnsDown(left: number) {
        this._label.string = left.toString();

        this._downTween.start(0);
    }
}