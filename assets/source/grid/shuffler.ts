import {Vec2, EventTarget} from "cc";
import {Grid} from "db://assets/source/grid/grid";
import {flatten} from "db://assets/utils/arrayExt";


export const SHUFFLE_ET = new EventTarget();

export class Shuffler {
    private readonly _grid: Grid;
    
    public constructor(grid: Grid) {
        this._grid = grid;
    }
    
    public shuffle() {
        const flatTiles = flatten(this._grid.tiles);
        const randomTiles = flatTiles.sort(() => Math.random() - 0.5);
        
        const oldPositions: Vec2[][] = [];

        for (let x = 0; x < this._grid.size.x; x++) {
            oldPositions.push([])
            for (let y = 0; y < this._grid.size.y; y++) {
                oldPositions[x].push(randomTiles[x * this._grid.size.y + y].position)
            }
        }
        
        for (let x = 0; x < this._grid.size.x; x++) {
            for (let y = 0; y < this._grid.size.y; y++) {
                this._grid.tiles[x][y] = randomTiles[x * this._grid.size.y + y];
                this._grid.tiles[x][y].move(new Vec2(x, y));
            }
        }
        
        SHUFFLE_ET.emit(0, oldPositions);
        return oldPositions;
    }
}