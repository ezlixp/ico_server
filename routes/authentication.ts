import { Application, Request, Response } from "express";
import generateJwtToken from "../security/jwtTokenGenerator";

/**
 * Maps all authentication-related endpoints.
 */
function mapAuthenticationEndpoints(app: Application): void {
    app.post("auth/getToken", async (request: Request, response: Response) => {
        // Gets a token if correct validationKey is provided
        const validationKey: string = request.body.validationKey;
        const result = generateJwtToken(validationKey);

        if (result.status) {
            response.status(200).json(result);
        } else {
            response.status(400).json(result);
        }
    });
}

export default mapAuthenticationEndpoints;
