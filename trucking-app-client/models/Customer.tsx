import { Model, Query } from "./Model";

export class Customer implements Model {
    id?: number;
    companyId?: number;
    customerName?: string
    deleted?: boolean

    constructor(id?: number, companyId?: number, customerName?: string, deleted?: boolean) {
        this.id = id;
        this.companyId = companyId;
        this.customerName = customerName;
        this.deleted = deleted;
    }
}


export class CustomerQuery implements Query {

}