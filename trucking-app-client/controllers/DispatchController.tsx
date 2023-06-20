import qs from 'qs'

import { CRUDController } from "./Controller";
import { Dispatch, DispatchQuery } from "../models/Dispatch";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";


export class DispatchController implements CRUDController<Dispatch, DispatchQuery> {

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
        // Build query string using dispatch query
        const q: any = { ...query };

        let customers: string = "";

        query.customers?.forEach((item: number) => {
            customers += `&customers=${item}`;
        })

        console.log("QUERY: ", q, customers);
        q.startDate = q.startDate?.dateString;
        q.endDate = q.endDate?.dateString;
        const queryString = qs.stringify(q) + customers;

        // Customers have to be sent to server 
        // with the format of customers=1,2,3

        console.log("QUERY STRING:", queryString)
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

    delete<T>(query: DispatchQuery): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update<T>(query: DispatchQuery, model: T): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create<T>(model: T): Promise<T> {
        throw new Error("Method not implemented.");
    }
}