import { NextFunction, Request, Response, Router } from "express";
import validateJwtToken from "../security/jwtTokenValidator.js";
import serverConfigModel from "../models/serverConfigModel.js";

/**
 * Maps all server config related endpoints. request.guildId is NOT defined in these routes, but request.serverId is.
 */
const configRouter = Router();
const serverConfigRouter = Router({ mergeParams: true });

// Register all middlewares.
configRouter.use(validateJwtToken);
configRouter.use("/:serverId", serverConfigRouter);

serverConfigRouter.use(validateJwtToken);
serverConfigRouter.use(async (request: Request, response: Response, next: NextFunction) => {
    const query = serverConfigModel.findOne({ serverId: request.params.serverId });
    // request.query = query;
    console.log(typeof query);
    const server = await query.exec();
    if (!server) {
        response.status(404).send({ error: "Could not find specified server." });
        return;
    }
    request.serverConfig = server;
    next();
});

configRouter.post("/", async (request: Request<{}, {}, { serverId: number; guildId: string }>, response: Response) => {
    try {
        const newServer = new serverConfigModel({ serverId: request.body.serverId, guildId: request.body.guildId });
        await newServer.save();
        response.send(newServer);
    } catch (error) {
        console.error("post config error:", error);
        response.status(500).send({ error: "Something went wrong processing the request." });
    }
});

serverConfigRouter.get("/", async (request: Request, response: Response) => {
    try {
        response.send(request.serverConfig);
    } catch (error) {
        console.error("get server config error:", error);
        response.status(500).send({ error: "Something went wrong processing the request." });
    }
});

serverConfigRouter.delete("/", async (request: Request, response: Response) => {
    try {
        serverConfigModel.findOneAndDelete({});
    } catch (error) {
        console.error("delete server config error:", error);
        response.status(500).send({ error: "Something went wrong processing the request." });
    }
});

export default configRouter;
