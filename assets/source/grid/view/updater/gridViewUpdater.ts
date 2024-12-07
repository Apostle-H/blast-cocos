import {ICommand, IResolver} from "db://assets/utils/command";

export class GridViewUpdater implements IResolver<Promise<void>> {
    private readonly _commands: ICommand<Promise<void>>[] = [];
    
    private _executing: boolean = false;
    
    public enqueue(command: ICommand<Promise<void>>) {
        this._commands.push(command);
        
        if (this._commands.length > 1 || this._executing) {
            return;
        }
        
        this.executeNext();
    }
    
    private executeNext() {
        if (this._commands.length === 0) {
            this._executing = false;
            return;
        }
        
        this._executing = true;
        this._commands.shift().do().then(this.executeNext.bind(this));
    }
}