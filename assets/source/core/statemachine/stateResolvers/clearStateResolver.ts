import {EventTarget} from "cc";
import {IStateMachine, StateAction, AStateResolver} from "db://assets/utils/stateMachine";
import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CORE_STATE_SWITCH_ET} from "db://assets/source/core/statemachine/stateMachine";
import {TileSelector} from "db://assets/source/grid/tileSelector";
import {Clearer} from "db://assets/source/grid/clearer";

export class ClearStateResolver extends AStateResolver<CoreState> {
    
    private readonly _stateMachine: IStateMachine<CoreState>;
    
    private readonly _tileSelector: TileSelector;
    private readonly _clearer: Clearer;
    
    private readonly _toFillEt: EventTarget;
    
    public constructor(
        stateMachine: IStateMachine<CoreState>, tileSelector: TileSelector, clearer: Clearer, toFillEt: EventTarget
    ) {
        super(CORE_STATE_SWITCH_ET, CoreState.CLEARING);
        
        this._stateMachine = stateMachine;
        this._tileSelector = tileSelector;
        this._clearer = clearer;
        this._toFillEt = toFillEt;
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
        this._toFillEt.once(0, this.toFill, this);
        
        this._clearer.tryClear(this._tileSelector.tile.position);
    }

    private onExit() {
        
    }

    private toFill() {
        this._stateMachine.switch(CoreState.FILLING);
    }
}