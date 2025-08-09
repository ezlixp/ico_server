import { AppError } from "../base/appError";

export class NotFoundError extends AppError {
    constructor(errorMessage: string) {
        super(errorMessage, 404);
    }
}
