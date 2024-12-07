import {TILE_CLICK_ET, TileView} from "db://assets/source/grid/view/tileView";
import {TileSelector} from "db://assets/source/grid/tileSelector";

export class TileClickInterpreter {
    private _tileSelector: TileSelector;
    
    public constructor(tileSelector: TileSelector) {
        this._tileSelector = tileSelector;
    }
    
    public bind() {
        TILE_CLICK_ET.on(0, this.interpret, this);
    }
    
    public expose() {
        TILE_CLICK_ET.off(0, this.interpret, this);
    }

    private interpret(tileView: TileView) {
        this._tileSelector.selectTile(tileView.tile);
    }
}