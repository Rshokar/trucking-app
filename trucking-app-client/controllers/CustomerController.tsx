import qs from 'qs'

import { CRUDController } from "./Controller";
import { Customer, CustomerQuery } from "../models/Customer";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";

export class CustomerController implements CRUDController<Customer, CustomerQuery> {

    async get<Customer>(query: CustomerQuery): Promise<Customer> {
        try {
            const results = await Request.request<Customer>({
                url: `/company/customers/${query.customer_id}`,
                method: Method.GET,
            });
            return results;
        } catch (err: any) {
            throw err;
        }
    }

    async getAll<Customer>(query: CustomerQuery): Promise<Customer[]> {
        // Build query string using customer query
        const q: any = { ...query };

        let res: Customer[] = [];
        try {
            res = await Request.request<Customer[]>({
                url: `/company/customers?${qs.stringify(q)}`,
                method: Method.GET,
            });
        } catch (err: any) {
            console.log(err.message);
            throw err;
        }

        return res;
    }

    async delete<T>(query: CustomerQuery): Promise<void> {
        try {
            await Request.request({
                url: `/company/customers/${query.customer_id}`,
                method: Method.DELETE,
            });
        } catch (err: any) {
            throw err;
        }
    }

    async update<T>(query: CustomerQuery, model: T): Promise<void> {
        try {
            await Request.request({
                url: `/company/customers/${query.customer_id}`,
                method: Method.PUT,
                data: model,
            });
        } catch (err: any) {
            throw err;
        }
    }

    async create<T>(model: T): Promise<T> {
        try {
            const result = await Request.request<T>({
                url: `company/customers`,
                method: Method.POST,
                data: model,
            });
            return result;
        } catch (err: any) {
            throw err;
        }
    }
}
