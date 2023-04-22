import { Model, Query } from './Model'


export class Company implements Model<CompanyQuery> {

    compay_id?: number;
    company_name?: string;
    owner_id?: number;

    constructor(id?: number, company_name?: string, owner_id?: number) {
        console.log("COMPANY CONSTRUCTOR")
        this.compay_id = id;
        this.company_name = company_name;
        this.owner_id = owner_id;
    }


    get<Company>(query: Partial<Company>): Promise<Company> {
        throw new Error('Method not implemented.');
    }

    getAll<Company>(query: Partial<Company>): Promise<Company[]> {
        throw new Error('Method not implemented.');
    }

    delete<Company>(attributes: Partial<Company>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    update<Company>(attributes: Partial<Company>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async create<Company>(attributes: Company): Promise<Company> {
        throw new Error('Method not implemented.');
    }

}


export class CompanyQuery implements Query {


}

