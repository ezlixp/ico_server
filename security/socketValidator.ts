import { NextFunction } from "express";
import { ExtendedError, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import "../config.js";

// Needs to match the token in the generator. Store it in a .env or .json for reusability.
const secretKey = process.env.JWT_SECRET_KEY as string;

/**
 * Checks if the token provided in the request's headers is valid.
 * If token is invalid, return status code 401 with an error message,
 * else, return void.
 */
// Checks if the token provided in the request's headers is valid.
// If token is invalid, return status code 401 with an error message.
function validateSocket(socket: Socket, next: (err?: ExtendedError) => void) {
    const authorizationHeader = socket.handshake.headers.authorization as string;

    if (!authorizationHeader) {
        console.log("A websocket connection was blocked");
        return next(new Error("No token provided"));
    }

    // Get authorization headers and extract token from "Bearer <token>"
    const token = authorizationHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err) => {
        if (err) {
            console.log("A websocket connection was blocked");
            return next(new Error("Invalid token provided"));
        }
        return next();
        // Goes to next step (function execution)
    });
}

export default validateSocket;
