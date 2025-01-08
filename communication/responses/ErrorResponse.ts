import { AppError } from "../../errors/base/appError.js";

export class ErrorResponse {
    public status: number;
    public title: string;
    public errorMessage: string;

    private constructor(status: number, title: string, errorMessage: string) {
        this.status = status;
        this.title = title;
        this.errorMessage = errorMessage;
    }

    static create(status: number, title: string, errorMessage: string) {
        return new ErrorResponse(status, title, errorMessage);
    }

    static createWithError(err: AppError) {
        return new ErrorResponse(err.statusCode, err.name, err.message);
    }
}

export class HttpErrorResponse {
    static InternalServerError = ErrorResponse.create(500, "InternalServerError", "An unknown error has occurred.");
}
