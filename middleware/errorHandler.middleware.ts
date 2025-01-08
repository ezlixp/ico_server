import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/base/appError.js";
import { ErrorResponse, HttpErrorResponse } from "../communication/responses/errorResponse.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).send(ErrorResponse.createWithError(err));
    } else {
        console.error("Unexpected error:", err);

        res.status(500).send(HttpErrorResponse.InternalServerError);
    }
};
