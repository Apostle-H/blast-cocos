import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CORE_STATE_SWITCH_ET} from "db://assets/source/core/statemachine/stateMachine";
import {IStateMachine, StateAction, AStateResolver} from "db://assets/utils/stateMachine";
import {TILE_SELECTED_ET} from "db://assets/source/grid/tileSelector";
import {Turns} from "db://assets/source/turns/turns";
import {Clearer} from "db://assets/source/grid/clearer";


export class IdleStateResolver extends AStateResolver<CoreState> {
    private readonly _stateMachine: IStateMachine<CoreState>;
    
    private readonly _clearer: Clearer;
    private readonly _turns: Turns;
    
    public constructor(stateMachine: IStateMachine<CoreState>, clearer: Clearer, turns: Turns) {
        super(CORE_STATE_SWITCH_ET, CoreState.IDLE);
        
        this._stateMachine = stateMachine;
        this._clearer = clearer;
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
        this._turns.countDown();

        if (!this._clearer.hasAnythingToClear()) {
            this.toLose();
            return;
        }
        
        TILE_SELECTED_ET.once(0, this.toClear, this);
    }
    
    private onExit() {
        
    }
    
    private toClear() {
        this._stateMachine.switch(CoreState.CLEARING);
    }

    private toLose() {
        this._stateMachine.switch(CoreState.LOSE);
    }
}