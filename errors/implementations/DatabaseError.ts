import {AppError} from "../base/AppError.js";

export class DatabaseError extends AppError {
    constructor() {
        super("An error has occurred while performing database actions.", 500);
    }
}