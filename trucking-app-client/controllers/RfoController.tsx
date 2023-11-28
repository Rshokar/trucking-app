import qs from 'qs';
import { RFO, RFOQuery } from "../models/RFO";
import myAxios from '../config/myAxios';
import { isAxiosError } from 'axios';

export class RFOController {

    async get(query: RFOQuery): Promise<RFO> {
        try {
            const response = await myAxios.get<RFO>(`/rfo/${query.rfo_id}`);
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error getting RFO");
        }
    }

    async getAll(query: RFOQuery): Promise<RFO[]> {
        const q: any = { ...query };

        q.startDate = q.startDateTime?.dateString;
        q.endDate = q.endDateTime?.dateString;
        const queryString = qs.stringify(q);

        try {
            const response = await myAxios.get<RFO[]>(`/rfo/?${queryString}`);
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error getting RFOs");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await myAxios.delete(`/rfo/${id}`);
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error deleting RFO");
        }
    }

    async update(id: string, model: RFO): Promise<RFO> {
        try {
            const response = await myAxios.put<RFO>(`/rfo/${id}`, model);
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error updating RFO");
        }
    }

    async create(model: RFO, confirm_upgrade: boolean = false): Promise<RFO> {
        try {

            let mod: any = model;
            if (confirm_upgrade)
                mod["confirmed"] = true;
            const response = await myAxios.post<RFO>(`/rfo`, mod);
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                const errorMessage = JSON.stringify(error.response.data);
                throw new Error(errorMessage);
            } else {
                throw new Error("Error creating RFO");
            }
        }
    }

    async sendRFOEmail(id: string): Promise<void> {
        try {
            await myAxios.post(`/rfo/send_operator_email/${id}`, {})
        } catch (error: any) {
            if (isAxiosError(error))
                throw new Error(error.response?.data);
            throw new Error("Error creating RFO");
        }
    }

}
