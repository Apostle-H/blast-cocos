import {Vec2, EventTarget} from "cc";
import {ICommand} from "db://assets/utils/command";
import {ViewShuffler} from "db://assets/source/grid/view/viewShuffler";


export const GRIDVIEW_SHUFFLED_ET = new EventTarget();

export class ShuffleCommand implements ICommand<Promise<void>> {
    private readonly _viewShuffler: ViewShuffler;
    private readonly _oldPositions: Vec2[][];
    
    public constructor(viewShuffler: ViewShuffler, oldPositions: Vec2[][]) {
        this._viewShuffler = viewShuffler;
        this._oldPositions = oldPositions;
    }
    
    public do(): Promise<void> {
        return this._viewShuffler.shuffle(this._oldPositions).then(() => GRIDVIEW_SHUFFLED_ET.emit(0));
    }
}