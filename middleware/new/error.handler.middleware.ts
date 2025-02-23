import {
    ExpressErrorMiddlewareInterface,
    Middleware,
} from 'routing-controllers';
import { AppError } from '../../errors/base/appError.js';
import {
    ErrorResponse,
    HttpErrorResponse,
} from '../../communication/responses/errorResponse.js';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(
        error: any,
        request: any,
        response: any,
        next: (err?: any) => any,
    ): void {
        if (response.headersSent) {
            next(error);
        }

        if (error instanceof AppError) {
            response
                .status(error.statusCode)
                .send(ErrorResponse.createWithError(error));
        } else {
            response.status(500).send(HttpErrorResponse.InternalServerError);
        }
    }
}
