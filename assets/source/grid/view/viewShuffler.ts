import {Vec2} from "cc";
import {GridView} from "db://assets/source/grid/view/gridView";


export class ViewShuffler {
    private readonly _gridView: GridView;
    private readonly _shuffleShiftTime: number;
    
    public constructor(gridView: GridView, shuffleShiftTime: number) {
        this._gridView = gridView;
        this._shuffleShiftTime = shuffleShiftTime;
    }
    
    public shuffle(oldPositions: Vec2[][]) {
        const shufflePromises: Promise<void>[] = [];

        for (let x = 0; x < oldPositions.length; x++) {
            for (let y = 0; y < oldPositions[x].length; y++) {
                const oldTileSlot = this._gridView.tileSlotViews[oldPositions[x][y].x][oldPositions[x][y].y];
                shufflePromises.push(oldTileSlot.shiftTile(this._gridView.tileSlotViews[x][y], this._shuffleShiftTime));
            }
        }

        return Promise.all(shufflePromises).then(() => {});
    }
}