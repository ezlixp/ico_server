import {AppError} from "../base/appError.js";

export class GuildVerificationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}