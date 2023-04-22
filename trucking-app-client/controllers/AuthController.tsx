import { Controller } from "./Controller";
import { User } from "../models/User";
import { Request, Method } from "../utils/Request";
import { Company } from "../models/Company";

export class AuthController extends Controller {

    static authenticate() {

    }

    static async login({ email, password }: User): Promise<User> {
        return await Request.request<User>({
            method: Method.POST,
            data: { email, password },
            url: "/auth/login"
        })
    }

    static async logOut(): Promise<{ message: string }> {
        return await Request.request<{ message: string }>({
            url: "/auth/logout",
            method: Method.DELETE
        })
    }

    static async register(u: User, company: string): Promise<{ user: User, company: Company }> {
        return await Request.request<{ user: User, company: Company }>(
            {
                method: Method.POST,
                data: { ...u, company },
                url: "/auth/register"
            }
        );
    }
}