import {EventTarget} from "cc";


export const SCORE_UP_ET: EventTarget = new EventTarget();

export class Score {
    private _score: number = 0;
    
    public get score() {
        return this._score;
    }
    
    public scoreUp(value: number) {
        if (value < 0) {
            return;
        }
        
        this._score += value;
        
        SCORE_UP_ET.emit(0, this.score, value);
    }
}