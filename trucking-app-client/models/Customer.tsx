import { Model, Query } from "./Model";

export class Customer implements Model {
    customer_id: number = 0;
    company_id?: number;
    customer_name?: string
    deleted?: boolean


    getId(): number {
        return this.customer_id
    }

}


export class CustomerQuery implements Query {

    constructor(limit?: number) {
        this.limit = limit ?? 20;
    }

    customer_id: number = 0;
    customer_name?: string;
    page: number = 0;
    limit: number = 20;
}