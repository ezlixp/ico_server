import {AppError} from "../base/appError.js";

export class HttpClientError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}