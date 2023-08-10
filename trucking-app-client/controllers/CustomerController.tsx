import qs from 'qs';
import { Customer, CustomerQuery } from "../models/Customer";
import { isAxiosError } from 'axios';
import myAxios from '../config/myAxios';
import { AuthController } from './AuthController';

export class CustomerController {

    async get(query: CustomerQuery): Promise<Customer> {
        try {
            const response = await myAxios.get<Customer>(`/company/customers/${query.customer_id}`, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error getting customer");
        }
    }

    async getAll(query: CustomerQuery): Promise<Customer[]> {
        const q: any = { ...query };

        try {
            const response = await myAxios.get<Customer[]>(`/company/customers?${qs.stringify(q)}`, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error getting customers");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const response = await myAxios.delete(`/company/customers/${id}`, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.status === 200;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error deleting customer");
        }
    }

    async update(id: string, model: Customer): Promise<Customer> {
        try {
            const response = await myAxios.put<Customer>(`/company/customers/${id}`, model, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error updating customer");
        }
    }

    async create(model: Customer): Promise<Customer> {
        try {
            const company = await AuthController.getCompany();
            model.company_id = company.company_id;

            const response = await myAxios.post<Customer>(`/company/customers`, model, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                console.log(error.response?.data)
                throw new Error(error.response?.data)
            }
            throw new Error("Error creating customer");
        }
    }
}
