import qs from 'qs';
import { Customer, CustomerQuery } from "../models/Customer";
import { isAxiosError } from 'axios';
import myAxios from '../config/myAxios';
import { AuthController } from './AuthController';
import { getAuthHeader } from '../utils/authHeader';
import Cache from '../utils/Cache';

export class CustomerController {

    async get(query: CustomerQuery): Promise<Customer> {
        try {
            const response = await myAxios.get<Customer>(`/company/customers/${query.customer_id}`, {
                headers: {
                    ...await getAuthHeader()
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
                    ...await getAuthHeader()
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
                    ...await getAuthHeader()
                }
            });
            const cache = Cache.getInstance(Customer);

            // If returns a 200 then there are related dispatches
            if (response.status === 201) {
                cache.setData([...cache.getData().filter(c => ("" + c.customer_id) !== id)])
                return true;
            }

            // Return true if deleted
            return false;
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
                    ...await getAuthHeader()
                }
            });

            const cCache = Cache.getInstance(Customer);

            const index = cCache.getData().findIndex(c => c.customer_id.toString() === id);

            // if not found in cache insert
            if (index === -1) cCache.setData([...cCache.getData(), response.data]);
            else {
                const cache = cCache.getData();
                cache[index] = response.data;
                cCache.setData([...cache]);
            }
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
                    ...await getAuthHeader()
                }
            });
            const cCache = Cache.getInstance(Customer);
            cCache.setData([...cCache.getData(), response.data]);
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data)
            }
            throw new Error("Error creating customer");
        }
    }
}
