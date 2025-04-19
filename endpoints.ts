import { Express, NextFunction, Request, Response, Router } from "express";
import statusRouter from "./routes/status.js";
import healthRouter from "./routes/healthCheck.js";
import adminRouter from "./routes/admin.js";
import modVersionRouter from "./routes/modVersion.js";
import userInfoRouter from "./routes/userInfo.js";
import configRouter from ".//routes/serverConfig.js";
import authenticationRouter from "./routes/authentication.js";
import onlineRouter from "./routes/guild/online.js";
import raidRouter from "./routes/guild/raids.js";
import tomeRouter from "./routes/guild/tomes.js";
import waitlistRouter from "./routes/guild/waitlist.js";
import { NotFoundError } from "./errors/implementations/notFoundError.js";
import { API_VERSION } from "./config.js";

export const mapEndpoints = (app: Express) => {
    const guildRouter = Router({ mergeParams: true });

    app.use("/api/:version/*extra", (request: Request<{ version: string }>, response: Response, next: NextFunction) => {
        if (request.params.version !== API_VERSION) {
            response.status(301).send({ error: `please use /api/${API_VERSION}` });
            return;
        }
        next();
    });

    // Map all endpoints that don't require guild id
    app.use("/", statusRouter);

    app.use("/healthz", healthRouter);

    app.use("/admin", adminRouter);

    app.use(`/api/${API_VERSION}/auth`, authenticationRouter);

    app.use(`/api/${API_VERSION}/mod`, modVersionRouter);

    app.use(`/api/${API_VERSION}/user`, userInfoRouter);

    app.use(`/api/${API_VERSION}/config`, configRouter);

    app.use(`/api/${API_VERSION}/guilds`, guildRouter);

    // Map endpoints that require guild id
    guildRouter.use("/online", onlineRouter);
    guildRouter.use("/raids", raidRouter);
    guildRouter.use("/tomes", tomeRouter);
    guildRouter.use("/waitlist", waitlistRouter);

    // Catch all for incorrect routes
    app.all("*extra", (_: Request) => {
        throw new NotFoundError("not found");
    });
};
