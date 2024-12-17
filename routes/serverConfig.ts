import { NextFunction, Request, Response, Router } from "express";
import validateJwtToken from "../security/jwtTokenValidator.js";
import serverConfigModel from "../models/serverConfigModel.js";

/**
 * Maps all server config related endpoints. request.guildId is NOT defined in these routes, but request.serverId is.
 */
const serverConfigRouter = Router({ mergeParams: true });

serverConfigRouter.use(validateJwtToken);
serverConfigRouter.use(async (request: Request, response: Response, next: NextFunction) => {
    const server = await serverConfigModel.findOne({ serverId: request.params.serverId }).exec();
});

serverConfigRouter.get("/:serverId", async (request: Request<{ serverId: string }>, response: Response) => {
    try {
        const server = await serverConfigModel.findOne({ serverId: request.params.serverId }).exec();
        if (!server) {
            response.status(404).send({ error: "Could not find configuration for specified server." });
            return;
        }

        response.send(server);
    } catch (error) {
        console.log("get server config error:", error);
        response.status(500).send({ error: "Something went wrong processing the request." });
    }
});

serverConfigRouter;

const serverIdRouter = Router();
serverIdRouter.use("/:serverId", serverConfigRouter);
export default serverIdRouter;
