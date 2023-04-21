import axios, { AxiosRequestConfig, AxiosError } from "axios";

export enum Method {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

interface RequestConfig extends AxiosRequestConfig {
    method: Method;
}

export class RequestError extends Error {
    statusCode: number | undefined;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class Request {
    static readonly API_URL = "http://10.0.0.134:5000/v1";

    static async request<T>(config: RequestConfig): Promise<T> {

        console.log("REQUEST CONFIG:", config)
        try {
            const response = await axios[config.method]<T>(`${this.API_URL}${config.url}`, {
                ...config.data,
            });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error))
                throw new RequestError(
                    error.response?.data.error,
                    error.response?.status
                )
            throw new RequestError("Error making request", 500)
        }
    }
}
