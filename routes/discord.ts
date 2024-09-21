import {Request, Response, Router} from "express";
import validateJwtToken from "../security/jwtTokenValidator.js";

interface DiscordSendRequestBody {
    message: string;
}

/**
 * Maps all discord-related endpoints
 */

// use socket io also for aspectlist dupe clearin?
// store unconfirmed requests, clear as you get socket response of "cleared"
// if disconnected main dps, server wil ask second in command for all  uncleared requests
const discordRouter = Router();

discordRouter.post(
    "/send",
    validateJwtToken,
    (request: Request<{}, {}, DiscordSendRequestBody>, response: Response) => {
        response.send("hi");
    }
);

export default discordRouter;
