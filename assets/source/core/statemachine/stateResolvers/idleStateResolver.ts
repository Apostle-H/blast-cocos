import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CORE_STATE_SWITCH_ET} from "db://assets/source/core/statemachine/stateMachine";
import {IStateMachine, StateAction, AStateResolver} from "db://assets/utils/stateMachine";
import {TILE_SELECTED_ET, TilesSelector} from "db://assets/source/grid/tilesSelector";
import {Turns} from "db://assets/source/turns/turns";
import {Score} from "db://assets/source/scoring/score";
import {Connected} from "db://assets/source/grid/connected";
import {Selector} from "db://assets/source/grid/selector";
import {ClearBoostsSelector} from "db://assets/source/grid/boosts/clearBoostsSelector";


export class IdleStateResolver extends AStateResolver<CoreState> {
    private readonly _stateMachine: IStateMachine<CoreState>;
    
    private readonly _tilesSelector: TilesSelector;
    private readonly _selector: Selector;
    private readonly _connected: Connected;
    private readonly _clearBoostsSelector: ClearBoostsSelector
    private readonly _score: Score;
    private readonly _turns: Turns;
    
    public constructor(
        stateMachine: IStateMachine<CoreState>, tilesSelector: TilesSelector, selector: Selector, connected: Connected, 
        clearBoostsSelector: ClearBoostsSelector, score: Score, turns: Turns
    ) {
        super(CORE_STATE_SWITCH_ET, CoreState.IDLE);
        
        this._stateMachine = stateMachine;
        this._tilesSelector = tilesSelector;
        this._selector = selector;
        this._connected = connected;
        this._clearBoostsSelector = clearBoostsSelector;
        this._score = score;
        this._turns = turns;
    }
    
    protected toggle(stateAction: StateAction) {
        switch (stateAction) {
            case StateAction.ENTER:
                this.onEnter();
                break;
            case StateAction.EXIT:
                this.onExit();
                break;
        }
    }
    
    private onEnter() {
        if (!this._connected.hasAnythingConnected() || (this._turns.left == 0 && this._score.value < this._score.target)) {
            this.toLose();
            return;
        } else if (this._score.value >= this._score.target) {
            this.toWin();
            return;
        }
        
        TILE_SELECTED_ET.once(0, this.toClear, this);
    }
    
    private onExit() {
        if (!this._clearBoostsSelector.hasBoostSelected) {
            this._turns.countDown();
        }
    }
    
    private toClear() {
        if (this._clearBoostsSelector.hasBoostSelected) {
            this._selector.select = this._clearBoostsSelector.boost.fromPoint.bind(this._clearBoostsSelector.boost);
        } else {
            this._selector.select = this._connected.fromPoint.bind(this._connected);
        }
        this._tilesSelector.selectTiles(this._selector.select(this._tilesSelector.positions[0]));
        
        if (this._tilesSelector.positions.length <= 1) {
            TILE_SELECTED_ET.once(0, this.toClear, this);
            return;
        }
        
        this._stateMachine.switch(CoreState.CLEARING);
    }

    private toLose() {
        this._stateMachine.switch(CoreState.LOSE);
    }
    
    private toWin() {
        this._stateMachine.switch(CoreState.WIN);
    }
}