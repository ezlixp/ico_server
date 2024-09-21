import {Request, Response, Router} from "express";
import generateJwtToken from "../security/jwtTokenGenerator.js";

/**
 * Maps all authentication-related endpoints.
 */
const authenticationRouter = Router();

authenticationRouter.post("/getToken", async (request: Request, response: Response) => {
    // Gets a token if correct validationKey is provided
    const validationKey: string = request.body.validationKey;
    const result = generateJwtToken(validationKey);

    if (result.status) {
        response.status(200).json(result);
    } else {
        response.status(400).json(result);
    }
});

export default authenticationRouter;
