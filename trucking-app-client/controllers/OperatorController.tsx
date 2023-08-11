import qs from 'qs';
import { Operator, OperatorQuery } from "../models/Operator";
import { isAxiosError } from 'axios';
import myAxios from '../config/myAxios';
import { AuthController } from './AuthController';
import { getAuthHeader } from '../utils/authHeader';

export class OperatorController {

    async get(query: OperatorQuery): Promise<Operator> {
        try {
            const response = await myAxios.get<Operator>(`/company/operators/${query.operator_id}`, {
                headers: {
                    ... await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error getting operator");
        }
    }

    async getAll(query: OperatorQuery): Promise<Operator[]> {
        const q: any = { ...query };

        try {
            const response = await myAxios.get<Operator[]>(`/company/operators?${qs.stringify(q)}`, {
                headers: {
                    ... await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error getting operators");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await myAxios.delete(`/company/operators/${id}`, {
                headers: {
                    ... await getAuthHeader()
                }
            });
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error deleting operator");
        }
    }

    async update(id: string, model: Operator): Promise<Operator> {
        try {
            const response = await myAxios.put<Operator>(`/company/operators/${id}`, model, {
                headers: {
                    ... await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error updating operator");
        }
    }

    async create(data: Operator): Promise<Operator> {
        try {
            const company = await AuthController.getCompany();
            data.company_id = company.company_id;

            const response = await myAxios.post<Operator>(`/company/operators`, data, {
                headers: {
                    ... await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error creating operator");
        }
    }
}
