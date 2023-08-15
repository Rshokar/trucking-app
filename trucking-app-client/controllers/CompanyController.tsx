import myAxios from '../config/myAxios';
import { Company } from "../models/Company";
import { isAxiosError } from 'axios';
import { Customer } from "../models/Customer";
import { AuthController } from "./AuthController";
import { getAuthHeader } from '../utils/authHeader';
export class CompanyController {


    async get(): Promise<Company> {
        try {
            const response = await myAxios.get<Company>(`/company/`, {
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


}