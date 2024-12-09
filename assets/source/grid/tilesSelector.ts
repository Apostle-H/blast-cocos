import {EventTarget, Vec2} from "cc";


export const TILE_SELECTED_ET = new EventTarget();
export const TILE_DESELECTED_ET = new EventTarget();

export class TilesSelector {
    private readonly _positions: Vec2[] = [];
    
    public get hasPositionsSelected() {
        return this._positions.length > 0;
    }
    
    public get positions() {
        return this._positions;
    }
    
    public addTile(position: Vec2) {
        this._positions.push(position);
        TILE_SELECTED_ET.emit(0);
    }

    public removeTile(position: Vec2) {
        const tileIndex = this._positions.indexOf(position);
        this._positions.splice(tileIndex, 1);
        TILE_SELECTED_ET.emit(0);
    }
    
    public selectTiles(positions: Vec2[]) {
        this._positions.length = 0;
        for (const position of positions) {
            this._positions.push(position);
        }
        TILE_SELECTED_ET.emit(0);
    }
    
    public deselectTiles() {
        this._positions.length = 0;
        TILE_DESELECTED_ET.emit(0);
    }
}