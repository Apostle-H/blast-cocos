import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CORE_STATE_SWITCH_ET} from "db://assets/source/core/statemachine/stateMachine";
import {IStateMachine, StateAction, StateResolver} from "db://assets/utils/stateMachine";
import {TILE_SELECTED_ET} from "db://assets/source/grid/tileSelector";

export class IdleStateResolver extends StateResolver<CoreState> {
    private readonly _stateMachine: IStateMachine<CoreState>;
    
    public constructor(stateMachine: IStateMachine<CoreState>) {
        super(CORE_STATE_SWITCH_ET, CoreState.IDLE);
        this._stateMachine = stateMachine;
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
        TILE_SELECTED_ET.once(0, this.toClear, this)
    }
    
    private onExit() {
        
    }
    
    private toClear() {
        this._stateMachine.switch(CoreState.CLEARING);
    }
}