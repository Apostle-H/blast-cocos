import {Vec2} from "cc";


export interface ITileView {
    move(position: Vec2): void;
    paint(color: number): void;
    clear(): void;
}