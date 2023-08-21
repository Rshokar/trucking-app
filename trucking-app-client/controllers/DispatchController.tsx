import qs from 'qs'
import { Dispatch, DispatchQuery } from "../models/Dispatch";
import { AuthController } from './AuthController';
import axios, { isAxiosError } from 'axios';
import myAxios from '../config/myAxios';
import { getAuthHeader } from "../utils/authHeader";

export class DispatchController {

    async get<Dispatch>(query: DispatchQuery): Promise<Dispatch> {
        try {
            const response = await myAxios.get<Dispatch>(`/dispatch/${query.dispatch_id}`, {
                headers: {
                    ...await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error getting dispatch");
        }
    }

    async getAll<Dispatch>(query: DispatchQuery): Promise<Dispatch[]> {
        const q: any = { ...query };

        let customers: string = "";

        query.customers?.forEach((item: number) => {
            customers += `&customers=${item}`;
        });

        const queryString = qs.stringify(q) + customers;
        const token = await AuthController.getJWTToken();
        try {
            const response = await myAxios.get<Dispatch[]>(`/dispatch?${queryString}`, {
                headers: {
                    ...await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error getting dispatches");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await myAxios.delete(`/dispatch/${id}`, {
                headers: {
                    ...await getAuthHeader()
                }
            });
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error deleting dispatch");
        }
    }

    async update(id: string, model: Dispatch): Promise<Dispatch> {
        const data = {
            notes: model.notes,
            date: model.date,
            customer_id: model.customer_id,
            expiry: model.expiry
        }
        try {
            const response = await myAxios.put<Dispatch>(`/dispatch/${id}`, data, {
                headers: {
                    ...await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error updating dispatch");
        }
    }

    async create(model: Dispatch): Promise<Dispatch> {
        try {
            const company = await AuthController.getCompany();
            model.company_id = company.company_id;

            const response = await myAxios.post<Dispatch>(`/dispatch`, model, {
                headers: {
                    ...await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error creating dispatch");
        }
    }
}
