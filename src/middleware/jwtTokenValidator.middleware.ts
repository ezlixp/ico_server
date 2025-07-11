import jwt, { JwtPayload } from "jsonwebtoken";
import "../config.js";
import { Response, NextFunction, Request } from "express";
import { ValidationError } from "../errors/implementations/validationError.js";
import { TokenErrors } from "../errors/messages/tokenErrors.js";

// Needs to match the token in the generator. Store it in a .env or .json for reusability.
const secretKey = process.env.JWT_SECRET_KEY as string;

/**
 * Checks if the token provided in the request's headers is valid.
 * If token is invalid, return status code 401 with an error message,
 * else, return void.
 */
function validateJwtToken(request: Request<{ wynnGuildId?: string }>, response: Response, next: NextFunction) {
    const authorizationHeader = request.headers["authorization"] as string | undefined;

    if (!authorizationHeader) {
        throw new ValidationError(TokenErrors.NO_TOKEN);
    }

    // Get authorization headers and extract token from "Bearer <token>"
    const token = authorizationHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, payload) => {
        if (err) {
            throw new ValidationError(TokenErrors.INVALID_TOKEN);
        }

        const p = payload! as JwtPayload;
        if (!p.guildId) {
            throw new ValidationError(TokenErrors.INVALID_TOKEN);
        }
        if (p.guildId !== "*" && request.params.wynnGuildId && p.guildId !== request.params.wynnGuildId) {
            throw new ValidationError(TokenErrors.UNPRIVILEGED_TOKEN);
        }

        next(); // Goes to next step (function execution)
    });
}

export default validateJwtToken;
