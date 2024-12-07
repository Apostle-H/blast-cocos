import {EventTarget} from "cc";
import {Tile} from "db://assets/source/grid/tile";


export const TILE_SELECTED_ET = new EventTarget();
export const TILE_DESELECTED_ET = new EventTarget();

export class TileSelector {
    private _tile: Tile;
    
    public get hasTileSelected() {
        return this._tile !== null;
    }
    
    public get tile() {
        return this._tile;
    }
    
    public selectTile(tile: Tile) {
        this._tile = tile;
        TILE_SELECTED_ET.emit(0);
    }
    
    public deselectTile() {
        this._tile = null;
        TILE_DESELECTED_ET.emit(0);
    }
}