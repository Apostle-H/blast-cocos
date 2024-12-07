import {EventTarget} from "cc";
import {ICommand} from "db://assets/utils/command";
import {ViewFiller} from "db://assets/source/grid/view/viewFiller";
import {Tile} from "db://assets/source/grid/tile";


export const GRIDVIEW_FILLED_ET = new EventTarget();

export class FillCommand implements ICommand<Promise<void>> {
    private readonly _viewFiller: ViewFiller;
    private readonly _fillShifts: Map<number, [Tile, number, number][]>;
    
    public constructor(viewFiller: ViewFiller, fillShifts: Map<number, [Tile, number, number][]>) {
        this._viewFiller = viewFiller;
        this._fillShifts = fillShifts;
    }
    
    public do(): Promise<void> {
        return this._viewFiller.fill(this._fillShifts).then(() => GRIDVIEW_FILLED_ET.emit(0));
    }
}