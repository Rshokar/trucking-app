import qs from 'qs'

import { CRUDController } from "./Controller";
import { Operator, OperatorQuery } from "../models/Operator";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";

export class OperatorController implements CRUDController<Operator, OperatorQuery> {

    async get<Operator>(query: OperatorQuery): Promise<Operator> {
        try {
            const results = await Request.request<Operator>({
                url: `/company/operators/${query.operator_id}`,
                method: Method.GET,
            });
            return results;
        } catch (err: any) {
            throw err;
        }
    }

    async getAll<Operator>(query: OperatorQuery): Promise<Operator[]> {
        // Build query string using operator query
        const q: any = { ...query };

        let res: Operator[] = [];
        try {
            res = await Request.request<Operator[]>({
                url: `/company/operators?${qs.stringify(q)}`,
                method: Method.GET,
            });
        } catch (err: any) {
            console.log(err.message);
            throw err;
        }

        return res;
    }

    async delete<T>(query: OperatorQuery): Promise<void> {
        try {
            await Request.request({
                url: `/company/operators/${query.operator_id}`,
                method: Method.DELETE,
            });
        } catch (err: any) {
            throw err;
        }
    }

    async update<T>(query: OperatorQuery, model: T): Promise<void> {
        try {
            await Request.request({
                url: `/company/operators/${query.operator_id}`,
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
                url: `company/operators`,
                method: Method.POST,
                data: model,
            });
            return result;
        } catch (err: any) {
            throw err;
        }
    }
}
