import { Model, Query } from './Model'


export class User {

    id?: string;
    role?: string;
    password?: string;
    email?: string;

    getId(): string {
        return (this.id || 0) + ''
    }
}


export class UserQuery implements Query {
}

