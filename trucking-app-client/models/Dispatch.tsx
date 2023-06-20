import { DateData } from 'react-native-calendars'

import { Model, Query } from './Model'
import { Customer } from './Customer';
import { Company } from './Company';

export class Dispatch implements Model {

    dispatch_id?: number = 0;
    company_id?: number
    customer_id?: number
    notes?: string;
    date?: string;
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
    startDate?: DateData;
    endDate?: DateData;
    company_id?: number;
    customers?: Set<number>;
    limit: number = 10;
    page: number = 0;
} 