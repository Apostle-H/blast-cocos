import { Vec2 } from "cc";
import {Tile} from "db://assets/source/grid/tile";
import {randomInteger} from "db://assets/utils/random";
import {vec2InBounds} from "db://assets/utils/bounds";
import {Pool} from "db://assets/utils/pool";
import {IGridView} from "db://assets/source/grid/view/iGridView";


export class Grid {
    private readonly _size: Vec2;
    private readonly _minBlastSize: number;
    private readonly _colorVariantsCount: number;
    
    private readonly _tilesPool: Pool<Tile> = new Pool(() => new Tile(this), () => {}, () => {});
    private readonly _tiles: Tile[][] = [];
    
    private readonly _view: IGridView;
    
    public get size() {
        return this._size;
    }
    
    public constructor(size: Vec2, minBlastSize: number, colorVariantsCount: number, view: IGridView) {
        this._size = size;
        this._minBlastSize = minBlastSize;
        this._colorVariantsCount = colorVariantsCount;
        this._view = view;

        this._view.resize(this.size);
        for (let x = 0; x < this._size.x; x++) {
            this._tiles.push([]);
            for (let y = 0; y < this._size.y; y++) {
                const position = new Vec2(x, y);
                const color = randomInteger(1, colorVariantsCount);
                const tile = new Tile(this, position, color); 
                this._tiles[x].push(tile);

                this._view.drawTile(tile)
            }
        }
    }
    
    public getTileNeighbors(tile: Tile) {
        const neighbourTiles = new Map<Vec2, Tile>();
        
        tile.neighboursPositions.forEach((direction, position) => {
            neighbourTiles.set(direction, this._tiles[position.x][position.y]);
        });
        
        return neighbourTiles;
    }
    
    public tryClear(position: Vec2) {
        if (!vec2InBounds(position, Vec2.ZERO, this._size)) {
            return [];
        }
        
        const targetTile = this._tiles[position.x][position.y];
        const visitedTilesPositions: Vec2[] = [];
        const clearTiles: Tile[] = [];
        
        const tilesToCheck = Array.from(this.getTileNeighbors(targetTile).values());
        while (tilesToCheck.length > 0) {
            const checkTile = tilesToCheck[tilesToCheck.length - 1];
            if (visitedTilesPositions.indexOf(checkTile.position) !== -1) {
                tilesToCheck.pop();
                continue;
            }
            
            visitedTilesPositions.push(checkTile.position);
            if (checkTile.color != targetTile.color) {
                tilesToCheck.pop();
                continue;
            }
            
            clearTiles.push(checkTile);
            tilesToCheck.push(...this.getTileNeighbors(checkTile).values());
            
            tilesToCheck.pop();
        }
        
        if (clearTiles.length < this._minBlastSize) {
            return [];
        }
        
        for (const tile of clearTiles) {
            this._tiles[tile.position.x][tile.position.y] = null;
            this._tilesPool.put(tile);
        }
        
        return clearTiles.map((tile) => tile.position);
    }
    
    public fillEmpty() {
        const shift = new Map<number, [number, number][]>
        
        for (let x = 0; x < this._size.x; x++) {
            for (let y = 0; y < this._size.y; y++) {
                if (this._tiles[x][y] != null) {
                    continue;
                }
                
                if (!shift.has(x)) {
                    shift.set(x, []);
                }

                let fallTile: Tile;
                for (let yFall = y + 1; yFall < this._size.y; yFall++) {
                    if (this._tiles[x][yFall] == null) {
                        continue;
                    }
                    
                    fallTile = this._tiles[x][yFall];
                    this._tiles[x][yFall] = null;
                    shift.get(x).push([yFall, y]);
                    
                    break;
                }
                
                if (fallTile == null) {
                    fallTile = this._tilesPool.get();
                    shift.get(x).push([-1, y]);
                }
                
                fallTile.move(new Vec2(x, y));
                fallTile.paint(randomInteger(0, this._colorVariantsCount))
            }
        }
        
        return shift;
    }
}


