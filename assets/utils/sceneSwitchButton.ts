import {Component, _decorator, Button, director, EventHandler} from "cc";
const {ccclass, property} = _decorator;


@ccclass("scene-switch-button")
export class SceneSwitchButton extends Component {
    @property
    private sceneName: string = "";
    
    private button: Button;
    
    private clickHandler: EventHandler = new EventHandler();
    
    protected onLoad() {
        this.button = this.node.getComponent(Button);
        
        this.clickHandler.target = this.node;
        this.clickHandler.component = "scene-switch-button";
        this.clickHandler.handler = "load";
    }
    
    protected onEnable() {
        this.button.clickEvents.push(this.clickHandler);
    }
    
    protected onDisable() {
        const handlerIndex = this.button.clickEvents.indexOf(this.clickHandler);
        this.button.clickEvents.splice(handlerIndex, 1);
    }
    
    private load() {
        director.loadScene(this.sceneName);
    }
} 