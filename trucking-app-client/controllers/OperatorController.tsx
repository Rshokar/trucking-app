import qs from 'qs'

import { Operator, OperatorQuery } from "../models/Operator";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";
import { AuthController } from './AuthController';

export class OperatorController {

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

    async delete<Operator>(id: string): Promise<void> {
        try {
            await Request.request({
                url: `/company/operators/${id}`,
                method: Method.DELETE,
            });
        } catch (err: any) {
            throw err;
        }
    }

    async update<Operator>(id: string, model: Operator): Promise<Operator> {
        try {
            const res: Operator = await Request.request({
                url: `/company/operators/${id}`,
                method: Method.PUT,
                data: model,
            });
            return res;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    async create<Operator>(data: Operator): Promise<Operator> {

        try {
            const company = await AuthController.getCompany();
            data.company_id = company.company_id;
            const result = await Request.request<Operator>({
                url: `/company/operators`,
                method: Method.POST,
                data: data,
            });
            return result;
        } catch (err: any) {
            throw err;
        }
    }
}
