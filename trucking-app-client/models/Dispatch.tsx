import { Model, Query } from './Model'
import { Request } from '../utils/Request';
import { Method } from '../utils/Request';

export class Dispatch implements Model {
    id?: number | undefined;

    company_id?: number
    customer_id?: number
    notes?: string;
    date?: string;

    constructor(company_id?: number, customer_id?: number, notes?: string, date?: string) {
        this.company_id = company_id;
        this.customer_id = customer_id;
        this.notes = notes;
        this.date = date;
    }


}

export class DispatchQuery implements Query<Dispatch> {

    model!: Dispatch;

    async get<Dispatch>(): Promise<Dispatch> {
        try {
            const results = await Request.request<Dispatch>({
                url: `/dispatch${this.model.company_id ? "/" + this.model.company_id : ""}`,
                method: Method.GET,
            });
            return results;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


    getAll<Dispatch>(): Promise<Dispatch[]> {

        throw new Error('Method not implemented.');
    }
    delete<Dispatch>(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    update<Dispatch>(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    create<Dispatch>(): Promise<Dispatch> {
        throw new Error('Method not implemented.');
    }


} 