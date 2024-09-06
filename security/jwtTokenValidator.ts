import jwt from "jsonwebtoken";
import "../config.js";
import {Request, Response, NextFunction} from "express";

// Needs to match the token in the generator. Store it in a .env or .json for reusability.
const secretKey = process.env.JWT_SECRET_KEY as string;

/**
 * Checks if the token provided in the request's headers is valid.
 * If token is invalid, return status code 401 with an error message,
 * else, return void.
 */
// Checks if the token provided in the request's headers is valid.
// If token is invalid, return status code 401 with an error message.
function validateJwtToken(request: Request, response: Response, next: NextFunction) {
    const authorizationHeader = request.headers["authorization"] as string | undefined;

    if (!authorizationHeader) {
        return response.status(401).json({error: "No token provided"});
    }

    // Get authorization headers and extract token from "Bearer <token>"
    const token = authorizationHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err) => {
        if (err) {
            return response.status(401).json({error: "Invalid token provided"});
        }

        next(); // Goes to next step (function execution)
    });
}

export default validateJwtToken;
