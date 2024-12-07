import {Vec2} from "cc";
import {GridView} from "db://assets/source/grid/view/gridView";
import {IResolver} from "db://assets/utils/command";
import {CLEAR_ET} from "db://assets/source/grid/clearer";
import {FILL_ET} from "db://assets/source/grid/filler";
import {SHUFFLE_ET} from "db://assets/source/grid/shuffler";
import {ShuffleCommand} from "db://assets/source/grid/view/updater/commands/shuffleCommand";
import {FillCommand} from "db://assets/source/grid/view/updater/commands/fillCommand";
import {ClearCommand} from "db://assets/source/grid/view/updater/commands/clearCommand";
import {ViewClearer} from "db://assets/source/grid/view/viewClearer";
import {ViewFiller} from "db://assets/source/grid/view/viewFiller";
import {ViewShuffler} from "db://assets/source/grid/view/viewShuffler";
import {Tile} from "db://assets/source/grid/tile";

export class GridEventsInterpreter {
    private readonly _viewClearer: ViewClearer;
    private readonly _viewFiller: ViewFiller;
    private readonly _viewShuffler: ViewShuffler;
    private readonly _gridUpdater: IResolver<Promise<void>>;
    
    public constructor(
        viewClearer: ViewClearer, viewFiller: ViewFiller, viewShuffler: ViewShuffler, gridUpdater: IResolver<Promise<void>>
    ) {
        this._viewClearer = viewClearer;
        this._viewFiller = viewFiller;
        this._viewShuffler = viewShuffler;
        this._gridUpdater = gridUpdater;
    }
    
    public bind() {
        CLEAR_ET.on(0, this.addClearCommand, this);
        FILL_ET.on(0, this.addFillCommand, this);
        SHUFFLE_ET.on(0, this.addShuffleCommand, this);
    }
    
    public expose() {
        CLEAR_ET.off(0, this.addClearCommand, this);
        FILL_ET.off(0, this.addFillCommand, this);
        SHUFFLE_ET.off(0, this.addShuffleCommand, this);
    }
    
    private addClearCommand(clearPositions: Vec2[]) {
        this._gridUpdater.enqueue(new ClearCommand(this._viewClearer, clearPositions))
    }
    
    private addFillCommand(fillShifts: Map<number, [Tile, number, number][]>) {
        this._gridUpdater.enqueue(new FillCommand(this._viewFiller, fillShifts));
    }
    
    private addShuffleCommand(oldPositions: Vec2[][]) {
        this._gridUpdater.enqueue(new ShuffleCommand(this._viewShuffler, oldPositions));
    }
}