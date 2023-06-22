import qs from 'qs'

import { CRUDController } from "./Controller";
import { RFO, RFOQuery } from "../models/RFO";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";

export class RFOController implements CRUDController<RFO, RFOQuery> {

    async get<RFO>(query: RFOQuery): Promise<RFO> {
        try {
            const results = await Request.request<RFO>({
                url: `/rfo/${query.rfo_id}`,
                method: Method.GET,
            });
            return results;
        } catch (err: any) {
            throw err;
        }
    }

    async getAll<RFO>(query: RFOQuery): Promise<RFO[]> {
        // Build query string using rfo query
        const q: any = { ...query };

        q.startDate = q.startDateTime?.dateString;
        q.endDate = q.endDateTime?.dateString;
        const queryString = qs.stringify(q);

        let res: RFO[] = [];
        try {
            res = await Request.request<RFO[]>({
                url: `/rfo?${queryString}`,
                method: Method.GET,
            });
        } catch (err: any) {
            console.log(err.message);
            throw err;
        }
        return res;
    }

    delete<T>(query: RFOQuery): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update<T>(query: RFOQuery, model: T): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create<T>(model: T): Promise<T> {
        throw new Error("Method not implemented.");
    }
}