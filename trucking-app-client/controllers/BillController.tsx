import * as qs from 'qs'
import { Bill, BillQuery } from "../models/Bill";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";
import axios, { isAxiosError } from 'axios';
import * as mime from 'mime'
import { Platform } from 'react-native';

export class BillController {

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
    async delete<Bill>(id: string): Promise<void> {
        try {
            await Request.request<void>({
                url: `/billing_ticket/${id}`,
                method: Method.DELETE
            })
        } catch (err: any) {
            if (isAxiosError(err))
                throw new Error(err.message);
            throw new Error("Error deleting bill");
        }
    }

    async update<Bill>(id: string, model: Bill): Promise<Bill> {
        try {
            return await Request.request<Bill>({
                url: `/billing_ticket/${id}`,
                method: Method.PUT,
                data: model,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } catch (err: any) {
            throw err
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
            const response = await fetch('http://10.0.0.134:5000/v1/billing_ticket/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                const responseData = await response.json();
                console.error('Data:', responseData);
                console.error('Status:', response.status);
                console.error('Headers:', response.headers);
                throw new Error(responseData || `Server responded with a ${response.status} status.`);
            }

            return await response.json() as Bill;
        } catch (err: any) {
            console.log(err);

            if (!err.response) {
                // The request was made but no response was received
                console.error('No response received:', err.request);
                throw new Error('No response received from server.');
            } else {
                // Something else caused the error
                throw new Error(err.message || "Error adding bill");
            }
        }
    }

    async getImageUrl(id: string): Promise<string> {
        try {
            const res = await Request.request({
                url: `/billing_ticket/${id}/image`,
                method: Method.GET
            })

            return res as string;
        } catch (err: any) {
            throw err;
        }
    }

}