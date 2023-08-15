import { Customer } from "../models/Customer";
import { Operator } from "../models/Operator";

export interface Subscriber<T> {
    id: string,
    onChange: (data: T[]) => void
}

export default class Cache<T> {
    private data: T[] = [];
    private subscribers: Subscriber<T>[] = [];

    // Maintain a map for instances
    private static instances: { [key: string]: Cache<any> } = {};

    // The constructor should be private to prevent direct construction calls
    private constructor() { }

    // The getInstance method is static and accepts a type argument
    public static getInstance<T>(type: new () => T): Cache<T> {
        // Use the name of the type as a key
        const typeName = type.name;

        if (!this.instances[typeName]) {
            this.instances[typeName] = new Cache<T>();
        }

        return this.instances[typeName];
    }

    public getData(): T[] {
        return this.data;
    }

    public setData(data: T[]): void {
        this.data = data;
        this.notifyAll();
    }

    public subscribe(subscriber: Subscriber<T>): void {
        this.subscribers.push(subscriber);
    }

    private notifyAll(): void {
        this.subscribers.forEach((d: Subscriber<T>) => d.onChange(this.data));
    }
}
