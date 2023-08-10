import AsyncStorage from "@react-native-async-storage/async-storage";

import { Controller } from "./Controller";
import { User } from "../models/User";
import { Request, Method } from "../utils/Request";
import { Company } from "../models/Company";
import { Customer } from "../models/Customer";


export class AuthController implements Controller {

    static authenticate() {

    }

    static async login({ email, password }: User): Promise<{ user: User, company: Company }> {
        const { user, company } = await Request.request<{ user: User, company: Company }>({
            method: Method.POST,
            data: { email, password },
            url: "/auth/login"
        })

        await this.saveUser(user)
        await this.saveCustomers(company.customers)
        await this.saveCompany(company)

        return { user, company };
    }

    static async logOut(): Promise<{ message: string }> {
        return await Request.authedRequest<{ message: string }>({
            url: "/auth/logout",
            method: Method.DELETE
        })
    }

    static async register(u: User, company: string, userId: string): Promise<{ user: User, company: Company }> {
        return await Request.authedRequest<{ user: User, company: Company }>(
            {
                method: Method.POST,
                data: { company, user_id: userId },
                url: "/auth/register"
            }
        );
    }

    static async isUserAuthed() {
        return await Request.request({
            method: Method.GET,
            url: "/auth/check_auth"
        })
    }


    public static async saveUser(u: any): Promise<void> {
        const user: User = new User()
        user.id = u["id"]
        user.role = u["role"]
        user.email = u["email"]


        await AsyncStorage.setItem('user', JSON.stringify(user));
    }

    public static async saveCompany(c: any): Promise<void> {
        const company: Company = new Company()
        company.company_id = c["company_id"];
        company.company_name = c["company_name"]
        company.owner_id = c["owner_id"];

        await AsyncStorage.setItem('company', JSON.stringify(company));
    }

    public static async saveCustomers(c: any): Promise<void> {
        const customers: Customer[] = c.map((c: any) => {
            const customer = new Customer()
            customer.customer_id = c["customer_id"]
            customer.company_id = c["company_id"]
            customer.customer_name = c["customer_name"]
            customer.deleted = c["deleted"]
            return customer;
        })

        await AsyncStorage.setItem('customers', JSON.stringify(customers));
    }

    static async getUser(): Promise<User> {
        try {
            const userString = await AsyncStorage.getItem('user');
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
            if (companyString !== null) {
                return JSON.parse(companyString);
            } else {
                throw new Error('Company data not found');
            }
        } catch (error: any) {
            throw new Error(`Failed to get company data: ${error.message}`);
        }
    }

    static async getCustomers(): Promise<Customer[]> {
        try {
            const customersString = await AsyncStorage.getItem('customers');
            if (customersString !== null) {
                return JSON.parse(customersString);
            } else {
                throw new Error('Customer data not found');
            }
        } catch (error: any) {
            throw new Error(`Failed to get customer data: ${error.message}`);
        }
    }


    static async setJWTToken(token: string): Promise<void> {
        await AsyncStorage.setItem('token', token);
    }

    static async getJWTToken(): Promise<string | null> {
        return await AsyncStorage.getItem('token');
    }

}