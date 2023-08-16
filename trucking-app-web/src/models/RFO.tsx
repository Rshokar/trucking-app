import { Dispatch } from './Dispatch';

export class RFO {

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
}