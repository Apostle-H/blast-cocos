import {TileSlotView} from "db://assets/source/grid/view/tileSlotView";
import {GridView} from "db://assets/source/grid/view/gridView";
import {TileView} from "db://assets/source/grid/view/tileView";
import {Pool} from "db://assets/utils/pool";
import {Tile} from "db://assets/source/grid/tile";

export class ViewFiller {
    private readonly _gridView: GridView;
    private readonly _tileViewsPool: Pool<TileView>;
    
    private readonly _tilesSpawnSlot: TileSlotView;
    private readonly _fallShiftTime: number;
    
    public constructor(gridView: GridView, tileViewsPool: Pool<TileView>, tilesSpawnSlot: TileSlotView, fallShiftTime: number) {
        this._gridView = gridView;
        this._tileViewsPool = tileViewsPool;
        this._tilesSpawnSlot = tilesSpawnSlot;
        this._fallShiftTime = fallShiftTime;
    }
    
    public fill(fillShifts: Map<number, [Tile, number, number][]>) {
        const fillPromises: Promise<void>[] = [];

        fillShifts.forEach((shifts, column) =>  {
            for (const shift of shifts) {
                let fromSlot: TileSlotView;
                if (shift[1] == -1) {
                    const tileView = this._tileViewsPool.get();
                    tileView.setTile(shift[0]);

                    fromSlot = this._tilesSpawnSlot;
                    fromSlot.setTileView(tileView);
                } else {
                    fromSlot = this._gridView.tileSlotViews[column][shift[1]];
                }
                const toSlot = this._gridView.tileSlotViews[column][shift[2]];

                fillPromises.push(fromSlot.shiftTile(toSlot, this._fallShiftTime));
            }
        });

        return Promise.all(fillPromises).then(() => {});
    }
}