import qs from 'qs'

import { Dispatch, DispatchQuery } from "../models/Dispatch";
import { Request, Method } from "../utils/Request";
import moment from 'moment';
import { AuthController } from './AuthController';


export class DispatchController {

    async get<Dispatch>(query: DispatchQuery): Promise<Dispatch> {
        try {
            const results = await Request.request<Dispatch>({
                url: `/dispatch/${query.dispatch_id}`,
                method: Method.GET,
            });
            return results;
        } catch (err: any) {
            throw err;
        }
    }

    async getAll<Dispatch>(query: DispatchQuery): Promise<Dispatch[]> {
        const q: any = { ...query };

        let customers: string = "";

        query.customers?.forEach((item: number) => {
            customers += `&customers=${item}`;
        })

        console.log("QUERY: ", q, customers);
        const queryString = qs.stringify(q) + customers;

        let res: Dispatch[] = [];
        try {
            res = await Request.request<Dispatch[]>({
                url: `/dispatch?${queryString}`,
                method: Method.GET,
            });
        } catch (err: any) {
            console.log(err.message);
            throw err;
        }

        return res;
    }

    async delete(id: string): Promise<void> {
        try {
            await Request.request({
                url: `/dispatch/${id}`,
                method: Method.DELETE,
            });
        } catch (err: any) {
            throw err;
        }
    }

    async update(id: string, model: Dispatch): Promise<Dispatch> {
        try {
            const updatedDispatch = await Request.request<Dispatch>({
                url: `/dispatch/${id}`,
                method: Method.PUT,
                data: JSON.stringify(model)
            });
            return updatedDispatch;
        } catch (err: any) {
            throw err;
        }
    }

    async create(model: Dispatch): Promise<Dispatch> {
        console.log(model);
        try {
            const company = await AuthController.getCompany();
            model.company_id = company.company_id;
            const createdDispatch = await Request.request<Dispatch>({
                url: `/dispatch`,
                method: Method.POST,
                data: model
            });
            return createdDispatch;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }
}
