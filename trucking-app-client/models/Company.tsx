import { Customer } from './Customer';
import { Model, Query } from './Model'


export class Company implements Model {

    id?: number;
    company_name?: string;
    owner_id?: number;
    customers: Customer[] = [];

    constructor(id?: number, company_name?: string, owner_id?: number) {
        this.id = id;
        this.company_name = company_name;
        this.owner_id = owner_id;
    }

}


export class CompanyQuery implements Query {


}