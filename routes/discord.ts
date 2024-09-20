import {Request, Response, Router} from "express";
import validateJwtToken from "../security/jwtTokenValidator.js";

interface DiscordSendRequestBody {
    message: string;
}

/**
 * Maps all discord-related endpoints
 */
const discordRouter = Router();
discordRouter.post(
    "/send",
    validateJwtToken,
    (request: Request<{}, {}, DiscordSendRequestBody>, response: Response) => {
        response.send("hi");
    }
);

export default discordRouter;
