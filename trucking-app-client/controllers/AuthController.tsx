import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/User";
import myAxios from '../config/myAxios';
import { Company } from "../models/Company";
import { isAxiosError } from 'axios';
import { Customer } from "../models/Customer";
export class AuthController {

    // This function is responsible for registering a user and 
    // Saving the user and company in the authcontrller object
    static async register(jwtToken: string, company: string, email: string): Promise<{ user: User, company: Company }> {
        const data = { company, token: jwtToken };

        try {
            const response = await myAxios.post<{ user: User, company: Company }>('/auth/register', data);
            AuthController.saveCompany(response.data.company);
            AuthController.saveUser({ ...response.data.user, email });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error during registration");
        }
    }


    static async login(token: string, email: string): Promise<{ user: User, company: Company }> {
        try {
            const response = await myAxios.post<{ user: User, company: Company }>('/auth/login', { id_token: token });
            AuthController.saveCompany(response.data.company);
            AuthController.saveUser({ ...response.data.user, email });
            return { ...response.data }
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data);
            }
            throw new Error("Error during registration");
        }
    }


    static async logout(): Promise<void> {

        try {
            await myAxios.delete('/auth/logout');
            await AsyncStorage.clear();
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

}