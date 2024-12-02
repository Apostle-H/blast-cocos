import { Vec2 } from "cc";
import {Grid} from "db://assets/source/grid/grid";
import {vec2InBounds} from "db://assets/utils/bounds";
import {ITileView} from "db://assets/source/grid/view/iTileView";

export class Tile {
    private readonly _grid: Grid;
    private _position: Vec2;
    private _color: number;
    
    private _neighboursPositions: Map<Vec2, Vec2> = new Map();
    
    private _view: ITileView;
    
    public get position() {
        return this._position;
    }
    
    public get color() {
        return this._color;
    }
    
    public get neighboursPositions() {
        return this._neighboursPositions;
    }
    
    public constructor(grid: Grid, position: Vec2 = Vec2.ZERO, color: number = 0) {
        this._grid = grid;
        
        this.move(position);
        this._color = color;
    }
    
    public setView(tileView: ITileView) {
        this._view = tileView;
        
        this._view.paint(this._color);
        this._view.move(this.position);
    }
    
    public move(newPosition: Vec2) {
        if (!vec2InBounds(newPosition, Vec2.ZERO, this._grid.size)) {
            return;
        }
        
        this._position = newPosition;
        
        this._neighboursPositions.clear();
        if (this._position.y < this._grid.size.y - 1) {
            this._neighboursPositions.set(new Vec2(0, 1), new Vec2(this._position.x, this.position.y + 1));
        }
        if (this._position.x < this._grid.size.x - 1) {
            this._neighboursPositions.set(new Vec2(1, 0), new Vec2(this._position.x + 1, this.position.y));
        }
        if (this._position.y > 0) {
            this._neighboursPositions.set(new Vec2(0, -1), new Vec2(this._position.x, this.position.y - 1));
        }
        if (this._position.x > 0) {
            this._neighboursPositions.set(new Vec2(-1, 0), new Vec2(this._position.x - 1, this.position.y));
        }
    }
    
    public paint(newColor: number) {
        this._color = newColor;
    }
    
    public clear() {
        this._view.clear();
    }
}