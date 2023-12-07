import { DateData } from 'react-native-calendars'
import { Model, Query } from './Model'

export class Operator implements Model {

    operator_id?: number;
    company_id?: number;
    operator_name?: string;
    operator_email?: string;
    operator_phone_country_code?: string = '+1';
    operator_phone?: string;
    contact_method?: string;
    confirmed?: boolean;


    getContactInfo() {
        console.log(this.contact_method)
        if (this.contact_method == 'sms')
            return this.operator_phone

        return this.operator_email
    }

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