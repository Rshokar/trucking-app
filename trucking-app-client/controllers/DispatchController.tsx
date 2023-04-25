import qs from 'qs'

import { CRUDController } from "./Controller";
import { Dispatch, DispatchQuery } from "../models/Dispatch";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";


export class DispatchController implements CRUDController<Dispatch, DispatchQuery> {

    async get<Dispatch>(query: DispatchQuery): Promise<Dispatch> {
        try {
            const results = await Request.request<Dispatch>({
                url: `/dispatch${query.company_id ? "/" + query.company_id : ""}`,
                method: Method.GET,
            });
            return results;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getAll<Dispatch>(query: DispatchQuery): Promise<Dispatch[]> {
        // Build query string using dispatch query
        const q: any = { ...query };

        q.startDate = q.startDate?.dateString;
        q.endDate = q.endDate?.dateString;
        q.customers = q.customers ? Array.from(q.customers) : undefined;
        const queryString = qs.stringify(q);
        console.log(queryString);

        return await Request.request<Dispatch[]>({
            url: `/dispatch?${queryString}`,
            method: Method.GET,
        });
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