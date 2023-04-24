export interface Controller {

}


export interface CRUDController<T, Q> extends Controller {
    get<T>(query: Q): Promise<T>
    getAll<T>(query: Q): Promise<T[]>
    delete<T>(query: Q): Promise<void>;
    update<T>(query: Q, model: T): Promise<void>;
    create<T>(model: T): Promise<T>;
}