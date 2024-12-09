import {EventTarget, Vec2} from "cc";
import {Tile} from "db://assets/source/grid/tile";
import {Grid} from "db://assets/source/grid/grid";
import {Pool} from "db://assets/utils/pool";


export const FILL_ET = new EventTarget();

export class Filler {
    private readonly _grid: Grid;
    private readonly _tilesPool: Pool<Tile>;
    
    public constructor(grid: Grid, tilesPool: Pool<Tile>) {
        this._grid = grid;
        this._tilesPool = tilesPool;
    }
    
    public fill() {
        const shift = new Map<number, [Tile, number, number][]>

        for (let x = 0; x < this._grid.size.x; x++) {
            for (let y = 0; y < this._grid.size.y; y++) {
                if (this._grid.tiles[x][y] != null) {
                    continue;
                }

                if (!shift.has(x)) {
                    shift.set(x, []);
                }

                let fallTile: Tile;
                for (let yFall = y + 1; yFall < this._grid.size.y; yFall++) {
                    if (this._grid.tiles[x][yFall] == null) {
                        continue;
                    }

                    fallTile = this._grid.tiles[x][yFall];
                    this._grid.tiles[x][yFall] = null;

                    break;
                }

                if (fallTile == null) {
                    fallTile = this._tilesPool.get();
                    fallTile.move(Vec2.NEG_ONE);
                }

                shift.get(x).push([fallTile, fallTile.position.y, y]);
                fallTile.move(new Vec2(x, y));
                this._grid.tiles[x][y] = fallTile;
            }
        }

        FILL_ET.emit(0, shift);
        return shift;
    }
}