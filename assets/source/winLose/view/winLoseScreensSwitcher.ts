import {Component, _decorator, Node} from "cc";
const {ccclass, property} = _decorator;


@ccclass("win-lose-screens-switcher")
export class WinLoseScreensSwitcher extends Component {
    @property({ type: Node })
    private gameScreen: Node;
    @property({ type: Node })
    private loseScreen: Node;
    @property({ type: Node })
    private winScreen: Node;
    
    public lose() {
        this.gameScreen.active = false;
        this.loseScreen.active = true;
    }
    
    public win() {
        this.gameScreen.active = false;
        this.winScreen.active = true;
    }
}
