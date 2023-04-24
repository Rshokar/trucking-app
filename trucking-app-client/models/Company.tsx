import { Model, Query } from './Model'


export class Company implements Model {

    id?: number;
    company_name?: string;
    owner_id?: number;

    constructor(id?: number, company_name?: string, owner_id?: number) {
        console.log("COMPANY CONSTRUCTOR")
        this.id = id;
        this.company_name = company_name;
        this.owner_id = owner_id;
    }

}


export class CompanyQuery implements Query {


}