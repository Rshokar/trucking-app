import { Model, Query } from './Model'


export class User implements Model {

    id?: number;
    role?: string;
    password?: string;
    email?: string;

    constructor(id?: number, role?: string, email?: string, password: string = "") {
        this.id = id;
        this.role = role;
        this.email = email;
        this.password = password;
    }



}


export class UserQuery implements Query {
}

