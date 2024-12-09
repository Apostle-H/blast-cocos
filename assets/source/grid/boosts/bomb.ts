import {Vec2} from "cc";
import {Grid} from "db://assets/source/grid/grid";
import {vec2InBounds} from "db://assets/utils/bounds";
import {IClearBoost} from "db://assets/source/grid/boosts/iClearBoost";


export class Bomb implements IClearBoost {
    private readonly _grid: Grid;
    private readonly _radius: number;
    
    private readonly _name: string = "Bomb";
    
    public get title() {
        return this._name;
    }
    
    public constructor(grid: Grid, radius: number) {
        this._grid = grid;
        this._radius = radius;
    }
    
    public fromPoint(position: Vec2) {
        if (!vec2InBounds(position, Vec2.ZERO, this._grid.size)) {
            return [];
        }

        const visitedPositions: Vec2[] = [position];
        const positionsInRadius: Vec2[] = [position];
        
        const positionsToCheck = this._grid.getTileNeighbors(this._grid.tiles[position.x][position.y]).map((tile) => tile.position);
        while (positionsToCheck.length > 0) {
            const checkPosition = positionsToCheck.shift();

            if (visitedPositions.indexOf(checkPosition) !== -1) {
                continue;
            }
            visitedPositions.push(checkPosition);

            if (new Vec2(position.x - checkPosition.x, position.y - checkPosition.y).length() > this._radius) {
                continue;
            }
            positionsInRadius.push(checkPosition);
            
            const neighbours = this._grid.getTileNeighbors(this._grid.tiles[checkPosition.x][checkPosition.y]).map((tile) => tile.position); 
            positionsToCheck.push(...neighbours);
        }
        
        return positionsInRadius;
    }
}