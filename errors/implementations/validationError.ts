import { AppError } from "../base/appError.js";

export class ValidationError extends AppError {
    constructor(errorMessage: string) {
        super(errorMessage, 400);
    }
}
