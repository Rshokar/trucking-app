import { Customer } from './Customer';
import { Company } from './Company';

export class Dispatch {

    dispatch_id?: number;
    company_id?: number
    customer_id?: number
    notes?: string;
    date?: string;
    customer?: Customer;
    company?: Company;
    rfos?: any;
    rfo_count?: number
}