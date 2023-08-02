import qs from 'qs'

import { RFO, RFOQuery } from "../models/RFO";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";
import { isAxiosError } from 'axios';

export class RFOController {

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

    async delete<RFO>(id: string): Promise<void> {
        try {
            await Request.request<void>({
                url: `/rfo/${id}`,
                method: Method.DELETE
            })
        } catch (err: any) {
            if (isAxiosError(err))
                throw new Error(err.message);
            throw new Error("Error deleting message");
        }
    }

    async update<RFO>(id: string, model: RFO): Promise<RFO> {
        try {
            return await Request.request<RFO>({
                url: `/rfo/${id}`,
                method: Method.PUT,
                data: model,
            });
        } catch (err: any) {
            if (isAxiosError(err))
                throw new Error(err.response?.data);
            throw new Error("Error updating RFO");
        }
    }

    async create<RFO>(model: RFO): Promise<RFO> {
        try {
            return await Request.request<RFO>({
                url: `/rfo`,
                method: Method.POST,
                data: model,
            })
        } catch (err: any) {
            if (isAxiosError(err))
                throw new Error(err.response?.data);
            throw new Error("Error adding RFO");
        }
    }
}