import {TILE_CLICK_ET, TileView} from "db://assets/source/grid/view/tileView";
import {TilesSelector} from "db://assets/source/grid/tilesSelector";

export class TileClickInterpreter {
    private _tileSelector: TilesSelector;
    
    public constructor(tileSelector: TilesSelector) {
        this._tileSelector = tileSelector;
    }
    
    public bind() {
        TILE_CLICK_ET.on(0, this.interpret, this);
    }
    
    public expose() {
        TILE_CLICK_ET.off(0, this.interpret, this);
    }

    private interpret(tileView: TileView) {
        this._tileSelector.selectTiles([tileView.tile.position]);
    }
}