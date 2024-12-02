export class Pool<T> {
    private readonly _items: T[] = [];
    
    private readonly _factory: () => T;
    private readonly _onGet: (item: T) => void;
    private readonly _onPut: (item: T) => void;
    
    public constructor(factory: () => T, onGet: (item: T) => void, onPut: (item: T) => void) {
        this._factory = factory;
        this._onGet = onGet;
        this._onPut = onPut;
    }
    
    public get() {
        if (this._items.length === 0) {
            this.add();
        }
        
        const item = this._items.shift();
        this._onGet(item);
        return item;
    }
    
    public put(item: T) {
        this._onPut(item);
        this._items.push(item);
    }
    
    private add() {
        this._items.push(this._factory());
    }
}