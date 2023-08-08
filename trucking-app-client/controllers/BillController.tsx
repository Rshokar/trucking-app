import qs from 'qs'
import { Bill, BillQuery } from "../models/Bill";
import { Request } from "../utils/Request";
import { Method } from "../utils/Request";
import axios, { isAxiosError } from 'axios';
import { cos } from 'react-native-reanimated';


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
            });
        } catch (err: any) {
            if (isAxiosError(err))
                throw new Error(err.response?.data);
            throw new Error("Error updating bill");
        }
    }

    async create(model: Bill): Promise<Bill> {
        // Create a new instance of FormData
        const formData = new FormData();

        model.file && formData.append('file', {
            uri: model.file.uri,
            type: model.file.type,
            name: model.file.fileName || 'uploaded-image.jpg' // Use original filename if available
        } as any);


        formData.append('ticket_number', model.ticket_number + '');
        formData.append('rfo_id', model.rfo_id + '');

        try {
            return await axios({
                url: `http://10.0.0.134:5000/v1/billing_ticket`,
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (err: any) {
            if (isAxiosError(err))
                throw new Error(err.response?.data);
            throw new Error("Error adding bill");
        }
    }

}