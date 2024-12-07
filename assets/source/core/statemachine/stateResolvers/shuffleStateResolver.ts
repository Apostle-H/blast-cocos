import {EventTarget} from "cc";
import {IStateMachine, StateAction, StateResolver} from "db://assets/utils/stateMachine";
import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CORE_STATE_SWITCH_ET} from "db://assets/source/core/statemachine/stateMachine";
import {Shuffler} from "db://assets/source/grid/shuffler";
import {Clearer} from "db://assets/source/grid/clearer";

export class ShuffleStateResolver extends StateResolver<CoreState> {
    private readonly _stateMachine: IStateMachine<CoreState>;

    private readonly _shuffler: Shuffler;
    private readonly _clearer: Clearer;
    
    private readonly _toIdleEt: EventTarget;
    
    private readonly _maxShufflesPerIterationCount: number;
    
    private _shufflesPerIterationCounter: number;
    private _awaitedShufflesPerIterationCounter: number;

    public constructor(
        stateMachine: IStateMachine<CoreState>, shuffler: Shuffler, clearer: Clearer, toIdleEt: EventTarget,
        maxShufflesPerIterationCount: number
    ) {
        super(CORE_STATE_SWITCH_ET, CoreState.SHUFFLING);
        
        this._stateMachine = stateMachine;
        this._shuffler = shuffler;
        this._clearer = clearer;
        this._toIdleEt = toIdleEt;
        this._maxShufflesPerIterationCount = maxShufflesPerIterationCount
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
        if (this._clearer.hasAnythingToClear()) {
            this.toIdle();
            return;
        }
        
        this._toIdleEt.on(0, this.shufflingCounter, this);
        
        for (let i = 0; i < this._maxShufflesPerIterationCount && !this._clearer.hasAnythingToClear(); i++) {
            this._shufflesPerIterationCounter++;
            this._shuffler.shuffle();
        }
    }

    private onExit() {
        this._toIdleEt.off(0, this.toIdle, this);
        
        this._shufflesPerIterationCounter = 0;
        this._awaitedShufflesPerIterationCounter = 0;
    }
    
    private shufflingCounter() {
        this._awaitedShufflesPerIterationCounter++;
        
        if (this._awaitedShufflesPerIterationCounter < this._shufflesPerIterationCounter) {
            return;
        }
        
        this.toIdle();
    }

    private toIdle() {
        this._stateMachine.switch(CoreState.IDLE);
    }
}