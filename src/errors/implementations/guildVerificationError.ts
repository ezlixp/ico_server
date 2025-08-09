import { AppError } from "../base/appError";

export class GuildVerificationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}
