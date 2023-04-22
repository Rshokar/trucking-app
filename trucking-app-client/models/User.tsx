import { Model, Query } from './Model'


export class User implements Model {

    id?: number;
    role?: string;
    password?: string;
    email?: string;

    constructor(id?: number, role?: string, email?: string, password: string = "") {
        console.log("USER CONSTRUCTOR")
        this.id = id;
        this.role = role;
        this.email = email;
        this.password = password;
    }



}


export class UserQuery implements Query<User> {

    model?: User;

    get<User>(): Promise<User> {
        throw new Error('Method not implemented.');
    }
    getAll<User>(): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
    delete<User>(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    update<User>(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    create<User>(): Promise<User> {
        throw new Error('Method not implemented.');
    }


}

