import {EventTarget} from "cc";
import {IStateMachine, StateAction} from "db://assets/utils/stateMachine";
import {CoreState} from "db://assets/source/core/statemachine/coreState";

export const CORE_STATE_SWITCH_ET = new EventTarget();

export class CoreStateMachine implements IStateMachine<CoreState> {
    private _startState: CoreState;
    
    private _currentState: CoreState = null;
    
    private _started: boolean = false;
    
    public get currentState(): CoreState {
        return this._currentState;
    }
    
    public constructor(startState: CoreState) {
        this._startState = startState;
    }
    
    public start() {
        if (this._started) {
            return;
        }
        
        this._started = true;
        this.switch(this._startState);
    }
    
    public switch(state: CoreState) {
        if (state == this._currentState || state == null) {
            return;
        }
        
        if (this._currentState != null) {
            CORE_STATE_SWITCH_ET.emit(this._currentState, StateAction.EXIT);
        } 
        this._currentState = state;
        CORE_STATE_SWITCH_ET.emit(this._currentState, StateAction.ENTER);
    }
}