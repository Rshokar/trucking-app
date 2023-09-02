import { isAxiosError } from "axios";
import myAxios from "../config/myAxios"; // Import your custom myAxios instance
import { AuthController } from "./AuthController";
import { Company } from "../models/Company";
import { User } from "../models/User";
import { UserCompanyFormResults } from "../components/Forms/UserCompanyForm";

export default class UserController {

    static async updateUserAndCompany(email: string, company_name: string): Promise<UserCompanyFormResults> {
        try {
            const response = await myAxios.put<UserCompanyFormResults>(
                `/user/account`,
                { email, company_name }
            );

            const comp: Company = await AuthController.getCompany();
            const user: User = await AuthController.getUser();

            comp.company_name = company_name;
            user.email = email;

            AuthController.saveUser(user);
            AuthController.saveCompany(comp);

            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                console.log(error.response?.status);
                throw new Error(error.response?.data);
            }
            throw new Error("Error updating user");
        }
    }

    static async sendForgotPasswordCode(email: string): Promise<void> {
        try {
            await myAxios.post<void>(
                '/user/forgot_password/send_code',
                { email }
            )
        } catch (err: any) {
            if (isAxiosError(err))
                throw new Error(err.response?.data)
            throw new Error("Error sending code")
        }
    }
}
