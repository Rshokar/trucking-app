import { Customer } from './Customer';


export class Company {
    company_id?: number;
    company_name?: string;
    owner_id?: number;
    customers: Customer[] = [];
}
