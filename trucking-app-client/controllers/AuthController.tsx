import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/User";
import { AuthController as Auth } from './AuthController'; // Self reference for JWT
import myAxios from '../config/myAxios';
import { Company } from "../models/Company";
import { isAxiosError } from 'axios';
import { Customer } from "../models/Customer";
import { getAuthHeader } from "../utils/authHeader";

export class AuthController {


    static async register(u: User, company: string, userId: string): Promise<{ user: User, company: Company }> {
        const data = { company, user_id: userId };

        try {
            const response = await myAxios.post<{ user: User, company: Company }>('/auth/register', data, {
                headers: {
                    ...await getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error during registration");
        }
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
        const token = await AsyncStorage.getItem('token');
        if (!token) throw Error("Auth token not found")
        return token
    }

}