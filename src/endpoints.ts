import { Express, NextFunction, Request, Response } from "express";
import statusRouter from "./routes/status";
import healthRouter from "./routes/healthCheck";
import adminRouter from "./routes/admin";
import modVersionRouter from "./routes/modVersion";
import userInfoRouter from "./routes/userInfo";
import infoRouter from "./routes/guildInfo";
import authenticationRouter from "./routes/authentication";
import { NotFoundError } from "./errors/implementations/notFoundError";
import { API_VERSION } from "./config";
import guildRouter from "./routes/guild/base";

export const mapEndpoints = (app: Express) => {
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

    app.use(`/api/${API_VERSION}/config`, infoRouter);

    app.use(`/api/${API_VERSION}/guilds`, guildRouter);

    // Catch all for incorrect routes
    app.all("*extra", (_: Request) => {
        throw new NotFoundError("not found");
    });
};
