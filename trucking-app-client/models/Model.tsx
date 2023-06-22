export interface Model {
    getId?(): number
}


export interface Query {
    page?: number;
    limit?: number;
}