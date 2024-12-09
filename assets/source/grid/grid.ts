import { Vec2 } from "cc";
import {Tile} from "db://assets/source/grid/tile";
import {Pool} from "db://assets/utils/pool";


export class Grid {
    private readonly _size: Vec2;
    private readonly _minBlastSize: number;
    private readonly _colorVariantsCount: number;
    
    private readonly _tiles: Tile[][] = [];
    
    public get size() {
        return this._size;
    }

    public get minBlastSize() {
        return this._minBlastSize;
    }

    public get colorVariantsCount() {
        return this._colorVariantsCount;
    }
    
    public get tiles() {
        return this._tiles;
    }
    
    public constructor(tilesPool: Pool<Tile>, size: Vec2, minBlastSize: number, colorVariantsCount: number) {
        this._size = size;
        this._minBlastSize = minBlastSize;
        this._colorVariantsCount = colorVariantsCount;

        for (let x = 0; x < this._size.x; x++) {
            this._tiles.push([]);
            for (let y = 0; y < this._size.y; y++) {
                const tile = tilesPool.get();
                const position = new Vec2(x, y);
                tile.move(position);
                
                this._tiles[x].push(tile);
            }
        }
    }
    
    public getTileNeighbors(tile: Tile) {
        const neighbourTiles: Tile[] = [];
        
        if (tile.position.x > 0) {
            neighbourTiles.push(this._tiles[tile.position.x - 1][tile.position.y]);
        }
        if (tile.position.x < this.size.x - 1) {
            neighbourTiles.push(this._tiles[tile.position.x + 1][tile.position.y]);
        }
        if (tile.position.y > 0) {
            neighbourTiles.push(this._tiles[tile.position.x][tile.position.y - 1]);
        }
        if (tile.position.y < this.size.y - 1) {
            neighbourTiles.push(this._tiles[tile.position.x][tile.position.y + 1]);
        }
        
        return neighbourTiles;
    }
}


