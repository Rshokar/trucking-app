import qs from 'qs'

import { CRUDController } from "./Controller";
import { Bill, BillQuery } from "../models/Bill";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";


export class BillController implements CRUDController<Bill, BillQuery> {

    async get<Bill>(query: BillQuery): Promise<Bill> {
        try {
            const results = await Request.request<Bill>({
                url: `/billing_ticket/${query.bill_id}`,
                method: Method.GET,
            });
            return results;
        } catch (err: any) {
            throw err;
        }
    }

    async getAll<Bill>(query: BillQuery): Promise<Bill[]> {
        // Build query string using billing_ticket query
        const q: any = { ...query };

        const queryString = qs.stringify(q)

        // Customers have to be sent to server 
        // with the format of customers=1,2,3

        console.log("QUERY STRING:", queryString)
        let res: Bill[] = [];
        try {
            res = await Request.request<Bill[]>({
                url: `/billing_ticket?${queryString}`,
                method: Method.GET,
            });
        } catch (err: any) {
            console.log(err.message);
            throw err;
        }



        return res;
    }

    delete<T>(query: BillQuery): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update<T>(query: BillQuery, model: T): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create<T>(model: T): Promise<T> {
        throw new Error("Method not implemented.");
    }
}