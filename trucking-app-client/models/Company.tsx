import { Customer } from './Customer';
import { Model, Query } from './Model'


export class Company implements Model {
    getId(): number {
        throw new Error('Method not implemented.');
    }

    company_id?: number;
    company_name?: string;
    owner_id?: number;
    customers: Customer[] = [];

}


export class CompanyQuery implements Query {


}