import {Vec2} from "cc";


export interface IClearBoost {
    get title(): string;
    
    fromPoint(position: Vec2): Vec2[];
}