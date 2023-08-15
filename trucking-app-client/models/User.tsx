import { Model, Query } from './Model'


export class User implements Model {

    id?: number;
    role?: string;
    password?: string;
    email?: string;

    getId(): number {
        return this.id || 0
    }
}


export class UserQuery implements Query {
}

