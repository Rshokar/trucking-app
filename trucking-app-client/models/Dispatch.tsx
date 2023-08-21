import { Model, Query } from './Model'
import { Customer } from './Customer';
import { Company } from './Company';

export class Dispatch implements Model {

    dispatch_id?: number;
    company_id?: number
    customer_id?: number
    notes?: string;
    date?: string;
    expiry?: string
    customer?: Customer;
    company?: Company;
    rfos?: any;
    rfo_count?: number

    getId?(): number {
        return this.dispatch_id ?? 0;
    }
}

export class DispatchQuery implements Query {
    dispatch_id?: number;
    startDate?: string;
    endDate?: string;
    company_id?: number;
    customers?: Set<number>;
    limit: number = 10;
    page: number = 0;
} 