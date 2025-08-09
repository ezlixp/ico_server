import { AppError } from "../base/appError";

export class HttpClientError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}
