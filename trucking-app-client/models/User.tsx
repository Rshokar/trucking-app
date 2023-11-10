import { Model, Query } from './Model'


export class User {

    id?: string;
    role?: string;
    password?: string;
    email?: string;
    emailValidated: boolean = false;

    getId(): string {
        return (this.id || 0) + ''
    }
}


export class UserQuery implements Query {
}

