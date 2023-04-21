export interface Model<Q extends Query> {
    id: number;

    get<T extends Model<Q>>(query: Partial<T>): Promise<T>
    getAll<T extends Model<Q>>(query: Partial<T>): Promise<T[]>
    delete<T extends Model<Q>>(attributes: Partial<T>): Promise<void>;
    update<T extends Model<Q>>(attributes: Partial<T>): Promise<void>;
    create<T extends Model<Q>>(attributes: T): Promise<T>;
}


export interface Query {

}