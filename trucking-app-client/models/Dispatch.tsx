import { DateData } from 'react-native-calendars'

import { Model, Query } from './Model'
import { Customer } from './Customer';

export class Dispatch implements Model {

    dispatch_id: number = 0;
    company_id?: number
    customer_id?: number
    notes?: string;
    date?: string;
    customer?: Customer;
    rfos?: any
    rfo_count?: number

    getId(): number {
        return this.dispatch_id
    }
}

export class DispatchQuery implements Query {
    startDate?: DateData;
    endDate?: DateData;
    company_id?: number;
    customers?: Set<number>;
    limit: number = 10;
    page: number = 0;
} 