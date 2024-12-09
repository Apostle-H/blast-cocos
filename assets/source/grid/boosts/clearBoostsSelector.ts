import {EventTarget} from "cc";
import {IClearBoost} from "db://assets/source/grid/boosts/iClearBoost";

export const CLEAR_BOOST_SELECTED_ET = new EventTarget();
export const CLEAR_BOOST_DESELECTED_ET = new EventTarget()

export class ClearBoostsSelector {
    private _boost: IClearBoost;
    
    public get boost() {
        return this._boost;
    }
    
    public get hasBoostSelected() {
        return this._boost != null;
    }
    
    public select(boost: IClearBoost) {
        if (this.boost == boost) {
            return;
        }
        
        this.deselect();

        this._boost = boost;
        CLEAR_BOOST_SELECTED_ET.emit(0);
    }
    
    public deselect() {
        if (this.boost == null) {
            return;
        }
        
        this._boost = null;
        CLEAR_BOOST_DESELECTED_ET.emit(0);
    }
}