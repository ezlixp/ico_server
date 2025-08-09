import { AppError } from "../base/appError";

export class TokenError extends AppError {
    constructor() {
        super("An error occurred while generating your token.", 400);
    }
}
