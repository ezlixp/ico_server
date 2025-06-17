import { AppError } from "../base/appError.js";

/** code 400 */
export class ValidationError extends AppError {
    constructor(errorMessage: string) {
        super(errorMessage, 400);
    }
}
