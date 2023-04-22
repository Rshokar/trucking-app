export interface Model {
    id?: number;
}


export interface Query<T extends Model> {

    model?: T;

    get<T>(): Promise<T>
    getAll<T>(): Promise<T[]>
    delete<T>(): Promise<void>;
    update<T>(): Promise<void>;
    create<T>(): Promise<T>;
}