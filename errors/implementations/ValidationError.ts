import {AppError} from "../base/AppError.js";

export class ValidationError extends AppError {
    constructor(errorMessage: string) {
        super(errorMessage, 400);
    }
}