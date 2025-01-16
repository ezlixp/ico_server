import { AppError } from "../base/appError.js";

export class NotFoundError extends AppError {
    constructor(errorMessage: string) {
        super(errorMessage, 404);
    }
}
