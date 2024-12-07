﻿import {Component, _decorator, Label, tween, Tween, Node, Vec3} from "cc";
import {SCORE_UP_ET} from "db://assets/source/scoring/score";
const {ccclass, property} = _decorator;


@ccclass("score-view")
export class ScoreView extends Component {
    @property
    private growMultiplier: number = 1.3;
    @property
    private growTime: number = 0.2;
    @property
    private shrinkTime: number = 0.2;

    private _label: Label;
    
    private _scoredTween: Tween<Node>;
    
    protected onLoad() {
        this._label = this.node.getComponent(Label);

        this._scoredTween = tween(this.node)
            .to(this.growTime, { scale: new Vec3(this.growMultiplier, this.growMultiplier, this.growMultiplier) })
            .to(this.shrinkTime, { scale: Vec3.ONE });
    }

    protected onEnable() {
        SCORE_UP_ET.on(0, this.scoreUp, this);
    }
    
    protected onDisable() {
        SCORE_UP_ET.off(0, this.scoreUp, this);
    }
    
    private scoreUp(score: number, value: number) {
        this._label.string = score.toString();
        
        this._scoredTween.start(0);
    }
}