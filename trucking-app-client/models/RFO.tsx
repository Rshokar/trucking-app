import { DateData } from 'react-native-calendars'
import { Model, Query } from './Model'
import { Dispatch } from './Dispatch';
import { Operator } from './Operator';

export class RFO implements Model {

    rfo_id?: number;
    dispatch_id?: number;
    operator_id?: number;
    trailer?: string;
    truck?: string;
    start_location?: string;
    dump_location?: string;
    load_location?: string;
    start_time?: string;

    dispatch?: Dispatch;
    operator?: Operator;

    getId?(): number {
        return this.rfo_id ?? 0;
    }
}

export class RFOQuery implements Query {
    rfo_id?: number;
    dispatch_id?: number;
    operator_id?: number;
    trailer?: string;
    truck?: string;
    start_location?: string;
    dump_location?: string;
    load_location?: string;
    start_time?: DateData;
    end_Time?: DateData;
    limit: number = 10;
    page: number = 0;
} 