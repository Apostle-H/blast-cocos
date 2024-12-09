import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CORE_STATE_SWITCH_ET} from "db://assets/source/core/statemachine/stateMachine";
import {IStateMachine, StateAction, AStateResolver} from "db://assets/utils/stateMachine";
import {TILE_SELECTED_ET, TileSelector} from "db://assets/source/grid/tileSelector";
import {Turns} from "db://assets/source/turns/turns";
import {Clearer} from "db://assets/source/grid/clearer";
import {Score} from "db://assets/source/scoring/score";


export class IdleStateResolver extends AStateResolver<CoreState> {
    private readonly _stateMachine: IStateMachine<CoreState>;
    
    private readonly _clearer: Clearer;
    private readonly _score: Score;
    private readonly _turns: Turns;
    
    public constructor(stateMachine: IStateMachine<CoreState>, clearer: Clearer, score: Score, turns: Turns) {
        super(CORE_STATE_SWITCH_ET, CoreState.IDLE);
        
        this._stateMachine = stateMachine;
        this._clearer = clearer;
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
        if (!this._clearer.hasAnythingToClear() || (this._turns.left == 0 && this._score.value < this._score.target)) {
            this.toLose();
            return;
        } else if (this._score.value >= this._score.target) {
            this.toWin();
            return;
        }
        
        TILE_SELECTED_ET.once(0, this.toClear, this);
    }
    
    private onExit() {
        this._turns.countDown();
    }
    
    private toClear() {
        this._stateMachine.switch(CoreState.CLEARING);
    }

    private toLose() {
        this._stateMachine.switch(CoreState.LOSE);
    }
    
    private toWin() {
        this._stateMachine.switch(CoreState.WIN);
    }
}