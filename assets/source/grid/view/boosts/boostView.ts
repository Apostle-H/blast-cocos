import {Component, _decorator, Label, Sprite, Color} from "cc";
const {ccclass, property} = _decorator;


@ccclass("boost-view")
export class BoostView extends Component {
    @property({ type: Sprite })
    private sprite: Sprite;
    private _label: Label;

    @property
    private defaultColor: Color = new Color();
    @property
    private selectedColor: Color = new Color();
    
    protected onLoad() {
        this._label = this.node.getComponentInChildren(Label);
        
        this.deselected();
    }
    
    public setText(text: string) {
        this._label.string = text;
    }
    
    public selected() {
        this.sprite.color = this.selectedColor;
    }
    
    public deselected() {
        this.sprite.color = this.defaultColor;
    }
}