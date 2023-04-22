import { Model, Query } from './Model'


export class User implements Model<UserQuery> {

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


    get<User>(query: Partial<User>): Promise<User> {
        throw new Error('Method not implemented.');
    }

    getAll<User>(query: Partial<User>): Promise<User[]> {
        throw new Error('Method not implemented.');
    }

    delete<User>(attributes: Partial<User>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    update<User>(attributes: Partial<User>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async create<User>(attributes: User): Promise<User> {
        throw new Error('Method not implemented.');
    }

}


export class UserQuery implements Query {


}

