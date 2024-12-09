import {Component, _decorator, Button, Label, Sprite, Color} from "cc";
const {ccclass, property} = _decorator;


@ccclass("boost-view")
export class BoostView extends Component{
    private _sprite: Sprite;
    private _label: Label;

    @property
    private defaultColor: Color = new Color();
    @property
    private selectedColor: Color = new Color();
    
    protected onLoad() {
        this._sprite = this.node.getComponent(Sprite);
        this._label = this.node.getComponentInChildren(Label);
        
        this.deselected();
    }
    
    public setText(text: string) {
        this._label.string = text;
    }
    
    public selected() {
        this._sprite.color = this.selectedColor;
    }
    
    public deselected() {
        this._sprite.color = this.defaultColor;
    }
}