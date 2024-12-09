import {AStateResolver, StateAction} from "db://assets/utils/stateMachine";
import {CoreState} from "db://assets/source/core/statemachine/coreState";
import {CORE_STATE_SWITCH_ET} from "db://assets/source/core/statemachine/stateMachine";
import {WinLoseScreensSwitcher} from "db://assets/source/winLose/view/winLoseScreensSwitcher";

export class LoseStateResolver extends AStateResolver<CoreState> {
    private readonly _winLoseScreensSwitcher: WinLoseScreensSwitcher;

    public constructor(winLoseScreensSwitcher: WinLoseScreensSwitcher) {
        super(CORE_STATE_SWITCH_ET, CoreState.LOSE);

        this._winLoseScreensSwitcher = winLoseScreensSwitcher;
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
        this._winLoseScreensSwitcher.lose();
    }

    private onExit() {

    }
}