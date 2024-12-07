import {EventTarget, Vec2} from "cc";
import {Grid} from "db://assets/source/grid/grid";
import {vec2InBounds} from "db://assets/utils/bounds";
import {Tile} from "db://assets/source/grid/tile";
import {Pool} from "db://assets/utils/pool";


export const CLEAR_ET = new EventTarget();

export class Clearer {
    private readonly _grid: Grid;
    private readonly _tilesPool: Pool<Tile>

    public constructor(grid: Grid, tilesPool: Pool<Tile>) {
        this._grid = grid;
        this._tilesPool = tilesPool;
    }
    
    public tryClear(position: Vec2) {
        if (!vec2InBounds(position, Vec2.ZERO, this._grid.size)) {
            return [];
        }

        const clearTiles = this.sameConnected(position);
        if (clearTiles.length < this._grid.minBlastSize) {
            return [];
        }

        for (const tile of clearTiles) {
            this._grid.tiles[tile.position.x][tile.position.y] = null;
            this._tilesPool.put(tile);
        }

        const clearedPositions = clearTiles.map((tile) => tile.position);
        CLEAR_ET.emit(0, clearedPositions);
        return clearedPositions;
    }

    public hasAnythingToClear() {
        for (let x = 0; x < this._grid.size.x; x++) {
            for (let y = 0; y < this._grid.size.y; y++) {
                if (this.sameConnected(new Vec2(x, y)).length < this._grid.minBlastSize) {
                    continue;
                }
                
                return true;
            }
        }
        
        return false;
    }

    private sameConnected(position: Vec2) {
        const targetTile = this._grid.tiles[position.x][position.y];
        const visitedTilesPositions: Vec2[] = [targetTile.position];
        const sameConnectedTiles: Tile[] = [targetTile];

        const tilesToCheck = this._grid.getTileNeighbors(targetTile);
        while (tilesToCheck.length > 0) {
            const checkTile = tilesToCheck.pop();
            if (visitedTilesPositions.indexOf(checkTile.position) !== -1) {
                continue;
            }

            visitedTilesPositions.push(checkTile.position);
            if (checkTile.color != targetTile.color) {
                continue;
            }

            sameConnectedTiles.push(checkTile);
            tilesToCheck.push(...this._grid.getTileNeighbors(checkTile));
        }

        return sameConnectedTiles;
    }
}