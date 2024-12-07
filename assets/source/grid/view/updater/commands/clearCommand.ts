import {Vec2, EventTarget} from "cc";
import {ICommand} from "db://assets/utils/command";
import {ViewClearer} from "db://assets/source/grid/view/viewClearer";


export const GRIDVIEW_CLEARED_ET = new EventTarget();

export class ClearCommand implements ICommand<Promise<void>> {
    private readonly _viewClearer: ViewClearer;
    private readonly _clearPositions: Vec2[];
    
    public constructor(viewClearer: ViewClearer, clearPositions: Vec2[]) {
        this._viewClearer = viewClearer;
        this._clearPositions = clearPositions;
    }
    
    public do(): Promise<void> {
        return this._viewClearer.clear(this._clearPositions).then(() => GRIDVIEW_CLEARED_ET.emit(0));
    }
}