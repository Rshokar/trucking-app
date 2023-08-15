import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { AuthController } from "../controllers/AuthController";

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
        console.log("\n\nREQUEST\n\n")

        try {
            const response = await axios[config.method]<T>(`${this.API_URL}${config.url}`, {
                ...config.data,
            }, { headers: { ...config.headers } });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new RequestError(
                    error.response?.data.error,
                    error.response?.status
                )
            }
            throw new RequestError("Error making request", 500)
        }
    }

    static async authedRequest<T>(config: RequestConfig): Promise<T> {
        console.log("\n\nAUTHED REQUEST\n\n")

        try {
            const token = await AuthController.getJWTToken();
            if (!token) throw Error("Auth token not found");

            console.log("TOKEN \n\n", token)

            const response = await axios[config.method]<T>(`${this.API_URL}${config.url}`,
                {
                    ...config.data,
                },
                {
                    headers: {
                        ...config.headers,
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                throw new RequestError(
                    error.response?.data.error,
                    error.response?.status
                )
            }
            throw new RequestError("Error making request", 500)
        }
    }
}
