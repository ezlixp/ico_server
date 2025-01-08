import {AppError} from "../base/AppError";

export class NotFoundError extends AppError {
    constructor(errorMessage: string) {
        super(errorMessage, 404);
    }
}