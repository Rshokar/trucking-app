import axios, { AxiosRequestConfig } from "axios";

enum Method {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

interface RequestConfig extends AxiosRequestConfig {
    method: Method;
}

export class Request {
    static readonly API_URL = "http://localhost:3000";

    static async request<T>(config: RequestConfig): Promise<T> {
        try {
            const response = await axios[config.method]<T>(`${this.API_URL}${config.url}`, {
                ...config,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
