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


export class CompanyQuery implements Query<Company> {

    model?: Company;

    get<Company>(): Promise<Company> {

        throw new Error('Method not implemented.');
    }

    getAll<Company>(): Promise<Company[]> {
        throw new Error('Method not implemented.');
    }

    delete<Company>(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    update<Company>(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async create<Company>(): Promise<Company> {
        throw new Error('Method not implemented.');
    }
}

