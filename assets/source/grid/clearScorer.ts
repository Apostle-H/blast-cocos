import {Vec2} from "cc";
import {Score} from "db://assets/source/scoring/score";
import {CLEAR_ET} from "db://assets/source/grid/clearer";


export class ClearScorer {
    private readonly _scorer: Score;
    
    public constructor(scorer: Score) {
        this._scorer = scorer;
    }
    
    public bind() {
        CLEAR_ET.on(0, this.scoreUp, this);
    }
    
    public expose() {
        CLEAR_ET.off(0, this.scoreUp, this);
    }
    
    private scoreUp(clearPositions: Vec2[]) {
        this._scorer.scoreUp(Math.pow(2, clearPositions.length));
    }
}