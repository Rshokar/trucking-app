import qs from 'qs';
import { Bill, BillQuery } from "../models/Bill";
import myAxios from '../config/myAxios';
import { isAxiosError } from 'axios';
import { AuthController } from './AuthController';
import * as mime from 'mime'
import { Platform } from 'react-native';

export class BillController {

    async get(query: BillQuery): Promise<Bill> {
        try {
            const response = await myAxios.get<Bill>(`/billing_ticket/${query.bill_id}`, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error getting bill");
        }
    }

    async getAll(query: BillQuery): Promise<Bill[]> {
        const q: any = { ...query };
        const queryString = qs.stringify(q);

        try {
            const response = await myAxios.get<Bill[]>(`/billing_ticket?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error getting bills");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await myAxios.delete(`/billing_ticket/${id}`, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error deleting bill");
        }
    }

    async update(id: string, model: Bill): Promise<Bill> {
        try {
            const response = await myAxios.put<Bill>(`/billing_ticket/${id}`, model, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error updating bill");
        }
    }

    async create(model: Bill): Promise<Bill> {
        const formData = new FormData();

        if (model.file) {
            const uri = Platform.select({
                ios: model.file.uri.replace("file://", ""),
                android: model.file.uri,
            });

            model.file && formData.append('file', {
                uri: uri,
                type: mime.getType(model.file.uri),
                name: 'uploaded-image.jpg'
            } as any);
        }

        formData.append('ticket_number', model.ticket_number + '');
        formData.append('rfo_id', model.rfo_id + '');

        try {
            const response = await myAxios.post<Bill>(`/billing_ticket/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error creating bill");
        }
    }

    async getImageUrl(id: string): Promise<string> {
        try {
            const response = await myAxios.get<string>(`/billing_ticket/${id}/image`, {
                headers: {
                    Authorization: `Bearer ${await AuthController.getJWTToken()}`
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error getting bill image URL");
        }
    }
}
