import axios, { isAxiosError } from "axios";
import { UserCompanyFormResults } from "../components/Forms/UserCompanyForm";
import { AuthController } from "./AuthController";
import { Company } from "../models/Company";
import { User } from "../models/User";
import { Method, Request } from "../utils/Request";
export default class UserController {

    async updateUserAndCompany(email: string, company_name: string): Promise<UserCompanyFormResults> {
        try {
            const res = await Request.request<UserCompanyFormResults>({
                url: `/user/account`,
                method: Method.PUT,
                data: { email, company_name }
            })
            const comp: Company = await AuthController.getCompany();
            const user: User = await AuthController.getUser();

            comp.company_name = company_name;
            user.email = email;

            AuthController.saveUser(user);
            AuthController.saveCompany(comp);

            return res;
        } catch (err: any) {
            if (isAxiosError(err)) {
                console.log(err.response?.status);
                throw new Error(err.response?.data);
            }
            throw new Error("Error updating user")
        }
    }
} 