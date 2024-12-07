export interface IResolver<T> {
    enqueue(command: ICommand<T>): void;
}

export interface ICommand<T> {
    do(): T;
}