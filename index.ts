import express, { NextFunction, Request, Response, Router } from "express";
import app, { server } from "./app.js";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import "./config";
import statusRouter from "./routes/status.js";
import raidRouter from "./routes/guild/raids.js";
import tomeRouter from "./routes/guild/tomes.js";
import modVersionRouter from "./routes/modVersion.js";
import "./sockets/discord.js";
import healthRouter from "./routes/healthCheck.js";
import userInfoRouter from "./routes/userInfo.js";
import configRouter from "./routes/serverConfig.js";
import onlineRouter from "./routes/guild/online.js";
import waitlistRouter from "./routes/guild/waitlist.js";
import authenticationRouter from "./routes/authentication.js";
import { registerMessageIndexes } from "./sockets/discord.js";
import adminRouter from "./routes/admin.js";
import { GuildDatabaseCreator } from "./services/guild/guildDatabaseCreator.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { NotFoundError } from "./errors/implementations/notFoundError.js";

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
try {
    const dbUrl = process.env.DB_URL;
    connect(dbUrl, { retryWrites: true, writeConcern: { w: "majority" } }).then(() => {
        const databaseCreator = new GuildDatabaseCreator();
        databaseCreator.registerDatabases().then(() => {
            registerMessageIndexes();
            const PORT = process.env.PORT || 3000;

            server.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        });
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
}

const guildRouter = Router({ mergeParams: true });
const apiVersion = "v2";

app.use("/api/:version/*extra", (request: Request<{ version: string }>, response: Response, next: NextFunction) => {
    if (request.params.version !== apiVersion) {
        response.status(301).send({ error: `please use /api/${apiVersion}` });
        return;
    }
    next();
});

// Map all endpoints that don't require guild id
app.use("/", statusRouter);

app.use("/healthz", healthRouter);

app.use("/admin", adminRouter);

app.use(`/api/${apiVersion}/mod`, modVersionRouter);

app.use(`/api/${apiVersion}/user`, userInfoRouter);

app.use(`/api/${apiVersion}/config`, configRouter);

app.use(`/api/${apiVersion}/guilds`, guildRouter);

// Map endpoints that require guild id
guildRouter.use("/auth", authenticationRouter);
guildRouter.use("/online", onlineRouter);
guildRouter.use("/raids", raidRouter);
// guildRouter.use("/aspects", aspectRouter);
guildRouter.use("/tomes", tomeRouter);
guildRouter.use("/waitlist", waitlistRouter);

// Catch all for incorrect routes
app.all("*extra", (_: Request, response: Response) => {
    throw new NotFoundError("not found");
});

app.use(errorHandler);
