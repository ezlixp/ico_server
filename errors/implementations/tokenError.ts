import {AppError} from "../base/appError.js";

export class TokenError extends AppError {
    constructor() {
        super("An error occurred while generating your token.", 400);
    }
}