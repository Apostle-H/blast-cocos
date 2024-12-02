import {Vec2} from "cc";
import {Tile} from "db://assets/source/grid/tile";

export interface IGridView {
    resize(size: Vec2): void;
    drawTile(tile: Tile): void;
}