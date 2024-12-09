import {Component, _decorator, Button, Prefab, Layout, instantiate, Vec2, UITransform, Size} from "cc";
import {IClearBoost} from "db://assets/source/grid/boosts/iClearBoost";
import {BoostView} from "db://assets/source/grid/view/boosts/boostView";
import {ClearBoostsSelector} from "db://assets/source/grid/boosts/clearBoostsSelector";
const {ccclass, property} = _decorator;


@ccclass("clear-boosts-selector-view")
export class ClearBoostsSelectorView extends Component {
    @property({type: Prefab})
    private boostViewPrefab: Prefab;
    
    private _transform: UITransform;
    private _layout: Layout;
    
    private _boostViews: Map<IClearBoost, BoostView> = new Map();
    private _boostClickHandlers: Map<IClearBoost, () => void> = new Map();
    
    private _clearBoostsSelector: ClearBoostsSelector;
    
    private _initialized: boolean = false;
    
    protected onLoad() {
        this._transform = this.node.getComponent(UITransform);
        this._layout = this.node.getComponent(Layout);
    }
    
    public init(clearBoostsSelector: ClearBoostsSelector) {
        this._clearBoostsSelector = clearBoostsSelector;
    }
    
    public initBoosts(boosts: IClearBoost[]) {
        if (this._initialized) {
            return;
        }
        
        const spacing = new Vec2(this._layout.spacingX * boosts.length);
        const cellSize = Math.floor((this._transform.contentSize.y - spacing.y) / boosts.length);

        const contentSize = new Vec2(spacing.x + (cellSize * boosts.length), spacing.y + cellSize);
        const padding = new Vec2(
            (this._transform.contentSize.x - contentSize.x) / 2,
            (this._transform.contentSize.y - contentSize.y) / 2
        );

        const cellContentSize = new Size(cellSize, cellSize);
        this._layout.cellSize = cellContentSize;

        this._layout.paddingLeft = padding.x;
        this._layout.paddingRight = padding.x;
        this._layout.paddingTop = padding.y;
        this._layout.paddingBottom = padding.y;

        for (const boost of boosts) {
            const boostView = instantiate(this.boostViewPrefab).getComponent(BoostView);
            this.node.addChild(boostView.node);
            boostView.setText(boost.title);
            
            this._boostViews.set(boost, boostView);
            
            const boostClickHandler = () => this.choose(boost);
            boostView.node.on(Button.EventType.CLICK, boostClickHandler, this);
            
            this._boostClickHandlers.set(boost, boostClickHandler);
        }

        this._initialized = true;
    }
    
    public choose(boost: IClearBoost) {
        if (boost == this._clearBoostsSelector.boost) {
            this._boostViews.get(this._clearBoostsSelector.boost).deselected();
            this._clearBoostsSelector.deselect();
            return;
        } 
        
        this._clearBoostsSelector.select(boost);
        this._boostViews.get(this._clearBoostsSelector.boost).selected();
    }
}