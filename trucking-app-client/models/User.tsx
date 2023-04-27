import { Model, Query } from './Model'


export class User implements Model {

    id: number = 0;
    role?: string;
    password?: string;
    email?: string;

    getId(): number {
        return this.id
    }



}


export class UserQuery implements Query {
}

