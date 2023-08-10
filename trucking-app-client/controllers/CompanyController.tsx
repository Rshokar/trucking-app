import myAxios from '../config/myAxios';
import { Company } from "../models/Company";
import { isAxiosError } from 'axios';
import { Customer } from "../models/Customer";
import { AuthController } from "./AuthController";
export class CompanyController {


    async get(): Promise<Company> {
        try {
            const response = await myAxios.get<Company>(`/company/`, {
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


}