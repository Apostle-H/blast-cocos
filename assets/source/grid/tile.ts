import { Vec2 } from "cc";


export class Tile {
    private _position: Vec2;
    private _color: number;
    
    public get position() {
        return this._position;
    }
    
    public get color() {
        return this._color;
    }
    
    public constructor(position: Vec2 = Vec2.ZERO, color: number = 0) {
        this.move(position);
        this.paint(color);
    }
    
    public move(newPosition: Vec2) {
        this._position = newPosition;
    }
    
    public paint(newColor: number) {
        this._color = newColor;
    }
}