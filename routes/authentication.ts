import { Request, Response, Router } from "express";
import generateJwtToken from "../security/jwtTokenGenerator.js";
import refreshJwtToken from "../security/jwtTokenRefresher.js";

/**
 * Maps all authentication-related endpoints.
 */
const authenticationRouter = Router();

authenticationRouter.post(
    "/get-token",
    async (request: Request<{}, {}, { validationKey: string }>, response: Response) => {
        // Gets a token if correct validationKey is provided
        const validationKey = request.body.validationKey;
        const result = generateJwtToken(validationKey);

        if (result.status) {
            response.status(200).json(result);
        } else {
            response.status(400).json(result);
        }
    }
);

authenticationRouter.post(
    "/refresh-token",
    async (request: Request<{}, {}, { originalToken: string; refreshToken: string }>, response: Response) => {
        // Gets a token if correct validationKey is provided
        const originalToken = request.body.originalToken;
        const refreshToken = request.body.refreshToken;
        const result = refreshJwtToken(originalToken, refreshToken);

        if (result.status) {
            response.status(200).json(result);
        } else {
            response.status(400).json(result);
        }
    }
);

export default authenticationRouter;
