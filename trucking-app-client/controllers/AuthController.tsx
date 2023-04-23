import AsyncStorage from "@react-native-async-storage/async-storage";

import { Controller } from "./Controller";
import { User } from "../models/User";
import { Request, Method } from "../utils/Request";
import { Company } from "../models/Company";


export class AuthController extends Controller {

    static authenticate() {

    }

    static async login({ email, password }: User): Promise<User> {
        const user = await Request.request<User>({
            method: Method.POST,
            data: { email, password },
            url: "/auth/login"
        })

        console.log('STRINGIFY: ', JSON.stringify(user))

        await AsyncStorage.setItem('user', JSON.stringify(user));
        return user;
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

    static async getUser(): Promise<User> {
        try {
            const userString = await AsyncStorage.getItem('user');
            console.log("USER STRING: ", userString)
            if (userString !== null) {
                return JSON.parse(userString);
            } else {
                throw new Error('User data not found');
            }
        } catch (error: any) {
            throw new Error(`Failed to get user data: ${error.message}`);
        }
    }

    static async getCompany(): Promise<Company> {
        try {
            const companyString = await AsyncStorage.getItem('company');
            console.log("COMPANY STRING: ", companyString)
            if (companyString !== null) {
                return JSON.parse(companyString);
            } else {
                throw new Error('Company data not found');
            }
        } catch (error: any) {
            throw new Error(`Failed to get company data: ${error.message}`);
        }
    }

}