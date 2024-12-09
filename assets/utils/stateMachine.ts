import {EventTarget} from "cc";


export interface IStateMachine<T extends number>  {
    get currentState(): T;
    
    start(): void;
    switch(state: T): void;
}

export enum StateAction {
    ENTER = 0,
    EXIT = 1
}

export abstract class AStateResolver<T extends number> {
    private readonly _switchEt: EventTarget;
    private readonly _targetState: T;
    
    protected constructor(switchEt: EventTarget, targetState: T) {
        this._switchEt = switchEt;
        this._targetState = targetState;
    }
    
    public bind() {
        this._switchEt.on(this._targetState, this.toggle, this);
    }
    
    public expose() {
        this._switchEt.off(this._targetState, this.toggle, this);
    }
    
    protected abstract toggle(stateAction: StateAction): void;
}