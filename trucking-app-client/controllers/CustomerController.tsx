import qs from 'qs'

import { CRUDController } from "./Controller";
import { Customer, CustomerQuery } from "../models/Customer";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";
import { AuthController } from './AuthController';
import axios, { AxiosResponse } from 'axios';

export class CustomerController {

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

    async delete(id: string): Promise<boolean> {
        try {
            const res: AxiosResponse = await axios.delete(`http://10.0.0.134:5000/v1/company/customers/${id}`)
            return res.status === 200
        } catch (err: any) {
            throw err;
        }
    }

    async update<Customer>(id: string, model: Customer): Promise<Customer> {
        try {
            const res: Customer = await Request.request({
                url: `/company/customers/${id}`,
                method: Method.PUT,
                data: model,
            });
            return res;
        } catch (err: any) {
            throw err;
        }
    }

    async create<Customer>(model: Customer): Promise<Customer> {
        try {
            const company = await AuthController.getCompany();
            model.company_id = company.company_id;
            const result = await Request.request<Customer>({
                url: `/company/customers`,
                method: Method.POST,
                data: model,
            });
            return result;
        } catch (err: any) {
            throw err;
        }
    }
}
