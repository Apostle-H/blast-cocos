import {EventTarget} from "cc";
import {IStateMachine, StateAction, AStateResolver} from "db://assets/utils/stateMachine";
import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CORE_STATE_SWITCH_ET} from "db://assets/source/core/statemachine/stateMachine";
import {Filler} from "db://assets/source/grid/filler";


export class FillStateResolver extends AStateResolver<CoreState> {
    private readonly _stateMachine: IStateMachine<CoreState>;

    private readonly _filler: Filler;
    
    private readonly _toShuffleEt: EventTarget;

    public constructor(stateMachine: IStateMachine<CoreState>, filler: Filler, toShuffleEt: EventTarget) {
        super(CORE_STATE_SWITCH_ET, CoreState.FILLING);
        
        this._stateMachine = stateMachine;
        this._filler = filler;
        this._toShuffleEt = toShuffleEt;
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
        this._toShuffleEt.once(0, this.toShuffling, this);
        
        this._filler.fill();
    }

    private onExit() {

    }

    private toShuffling() {
        this._stateMachine.switch(CoreState.SHUFFLING);
    }
}