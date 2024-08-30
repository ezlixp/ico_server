﻿import jwt from "jsonwebtoken";
import "../config.js";

// Needs to match the token in the generator. Store it in a .env or .json for reusability.
const secretKey = process.env.JWT_SECRET_KEY;

/**
 * Checks if the token provided in the request's headers is valid.
 * If token is invalid, return status code 401 with an error message,
 * else, return void.
 * @param {Request} request
 * @param {Response} response
 * @param {Function} next
 * @returns {void}
 */
// Checks if the token provided in the request's headers is valid.
// If token is invalid, return status code 401 with an error message.
function validateJwtToken(request, response, next) {
    if (request.headers["authorization"] == null)
        return response.status(401).json({ error: "No token provided" });

    // Get authorization headers and extract token from "Bearer <token>"
    const token = request.headers["authorization"].split(" ")[1];

    jwt.verify(token, secretKey, (err) => {
        if (err)
            return response
                .status(401)
                .json({ error: "Invalid token provided" });

        next(); // Goes to next step (function execution)
    });
}

export default validateJwtToken;
