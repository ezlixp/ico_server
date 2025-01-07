import {ErrorRequestHandler} from "express";
import {AppError} from "../errors/base/AppError.js";
import {ErrorResponse, HttpErrorResponse} from "../communication/responses/ErrorResponse.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).send(ErrorResponse.createWithError(err));
    } else {
        console.error("Unexpected error:", err);

        res.status(500).send(HttpErrorResponse.InternalServerError)
    }
};