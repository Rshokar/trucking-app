import { DateData } from 'react-native-calendars'
import { Model, Query } from './Model'
import { Dispatch } from './Dispatch';

export class Operator implements Model {

    operator_id?: number;
    company_id?: number;
    operator_name?: string;
    operator_email?: string;
    operator_phone_country_code?: string;
    operator_phone?: string;
    contact_method?: string;
    confirmed?: boolean;

    getId?(): number {
        return this.operator_id ?? 0;
    }
}

export class OperatorQuery implements Query {

    constructor(limit?: number) {
        this.limit = limit ?? 10;
    }
    operator_id?: number;
    company_id?: number;
    operator_name?: string;
    operator_email?: string;
    limit: number = 10;
    page: number = 0;
} 