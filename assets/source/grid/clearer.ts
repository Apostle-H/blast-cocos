import {EventTarget, Vec2} from "cc";
import {Grid} from "db://assets/source/grid/grid";
import {Tile} from "db://assets/source/grid/tile";
import {Pool} from "db://assets/utils/pool";
import {Connected} from "db://assets/source/grid/connected";


export const CLEAR_ET = new EventTarget();

export class Clearer {
    private readonly _grid: Grid;
    private readonly _tilesPool: Pool<Tile>

    public constructor(grid: Grid, tilesPool: Pool<Tile>) {
        this._grid = grid;
        this._tilesPool = tilesPool;
    }
    
    public clear(positions: Vec2[]) {
        if (positions.length < this._grid.minBlastSize) {
            return [];
        }

        for (const position of positions) {
            const tile = this._grid.tiles[position.x][position.y]
            this._grid.tiles[position.x][position.y] = null;
            
            this._tilesPool.put(tile);
        }
        
        CLEAR_ET.emit(0, positions);
        return positions;
    }
}