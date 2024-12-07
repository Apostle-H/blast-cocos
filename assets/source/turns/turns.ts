import {EventTarget} from "cc";


export const TURNS_DOWN_ET: EventTarget = new EventTarget();

export class Turns {
    private _left: number;
    
    public get left() {
        return this._left;
    }
    
    public constructor(left: number) {
        this._left = left;
    }
    
    public countDown() {
        this._left--;
        
        TURNS_DOWN_ET.emit(0, this._left);
    }
}