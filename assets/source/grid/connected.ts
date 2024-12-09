import {Vec2} from "cc";
import {Grid} from "db://assets/source/grid/grid";
import {vec2InBounds} from "db://assets/utils/bounds";

export class Connected {
    private readonly _grid: Grid;

    public constructor(grid: Grid) {
        this._grid = grid;
    }

    public fromPoint(position: Vec2) {
        if (!vec2InBounds(position, Vec2.ZERO, this._grid.size)) {
            return [];
        }
        
        const targetTile = this._grid.tiles[position.x][position.y];
        
        const visitedPositions: Vec2[] = [targetTile.position];
        const connectedPositions: Vec2[] = [targetTile.position];

        const tilesToCheck = this._grid.getTileNeighbors(targetTile);
        while (tilesToCheck.length > 0) {
            const checkTile = tilesToCheck.pop();
            if (visitedPositions.indexOf(checkTile.position) !== -1) {
                continue;
            }
            visitedPositions.push(checkTile.position);

            if (checkTile.color != targetTile.color) {
                continue;
            }

            connectedPositions.push(checkTile.position);
            tilesToCheck.push(...this._grid.getTileNeighbors(checkTile));
        }

        return connectedPositions;
    }
    
    public hasAnythingConnected() {
        for (let x = 0; x < this._grid.size.x; x++) {
            for (let y = 0; y < this._grid.size.y; y++) {
                if (this.fromPoint(new Vec2(x, y)).length < this._grid.minBlastSize) {
                    continue;
                }

                return true;
            }
        }

        return false;
    }
}