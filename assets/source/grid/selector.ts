import {Vec2} from "cc";


export class Selector {
    private _selectFunc: (position: Vec2) => Vec2[];
    
    public get select(): (position: Vec2) => Vec2[] {
        return this._selectFunc;
    }
    
    public set select(selectFunc: (position: Vec2) => Vec2[]) {
        this._selectFunc = selectFunc;
    }
}