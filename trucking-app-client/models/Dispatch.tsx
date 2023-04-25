import { DateData } from 'react-native-calendars'

import { Model, Query } from './Model'
import { Request } from '../utils/Request';
import { Method } from '../utils/Request';
import { Customer } from './Customer';

export class Dispatch implements Model {
    id?: number | undefined;

    company_id?: number
    customer_id?: number
    notes?: string;
    date?: string;
    customer?: Customer;
    rfos?: any

    constructor(company_id?: number, customer_id?: number, notes?: string, date?: string, customer?: Customer, rfos?: any) {
        this.company_id = company_id;
        this.customer_id = customer_id;
        this.notes = notes;
        this.date = date;
        this.customer = customer;
        this.rfos = rfos
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