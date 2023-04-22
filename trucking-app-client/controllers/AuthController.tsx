import { Controller } from "./Controller";
import { User } from "../models/User";
import { Request, Method } from "../utils/Request";
import { Company } from "../models/Company";

export class AuthController extends Controller {

    static authenticate() {

    }

    static login() {

    }

    static logOut() {

    }

    static async register(u: User, company: string): Promise<{ user: User, company: Company }> {
        return await Request.request<{ user: User, company: Company }>({ method: Method.POST, data: { ...u, company }, url: "/auth/register" });
    }
}