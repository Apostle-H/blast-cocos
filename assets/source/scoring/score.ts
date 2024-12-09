import {EventTarget} from "cc";


export const SCORE_UP_ET: EventTarget = new EventTarget();

export class Score {
    private _value: number = 0;
    private readonly _target: number;
    
    public constructor(target: number) {
        this._target = target;
    }
    
    public get value() {
        return this._value;
    }
    
    public get target() {
        return this._target;
    }
    
    public scoreUp(value: number) {
        if (value < 0) {
            return;
        }
        
        this._value += value;
        
        SCORE_UP_ET.emit(0, this.value, this.target, value);
    }
}