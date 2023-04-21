import { Controller } from "./Controller";
import { User } from "../models/User";

export class AuthController extends Controller {

    static authenticate() {

    }

    static login() {

    }

    static logOut() {

    }

    // This will make a user, if successfull it will also 
    // create the company. If not return an message.
    static async register(user: User): Promise<User> {
        try {
            const newUser: User | -1 = await user.create(user);
            console.log(newUser)
            return user;
        } catch (error) {
            throw error;
        }

    }
}