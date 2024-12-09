import {Vec2} from "cc";
import {GridView} from "db://assets/source/grid/view/gridView";
import {TileView} from "db://assets/source/grid/view/tileView";
import {Pool} from "db://assets/utils/pool";


export class ViewClearer {
    private readonly _gridView: GridView;
    private readonly _tileViewsPool: Pool<TileView>;
    
    public constructor(gridView: GridView, tileViewsPool: Pool<TileView>) {
        this._gridView = gridView;
        this._tileViewsPool = tileViewsPool;
    }
    
    public clear(clearPositions: Vec2[]) {
        const clearPromises: Promise<void>[] = [];

        for (const position of clearPositions) {
            const [clearPromise, clearTileView] = this._gridView.tileSlotViews[position.x][position.y].clear();
            clearPromises.push(clearPromise.then(() => this._tileViewsPool.put(clearTileView)));
        }

        return Promise.all(clearPromises).then(() => {});
    }
}