import express, { NextFunction, Request, Response, Router } from "express";
import app, { server } from "./app.js";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import "./config";
import statusRouter from "./routes/status.js";
import authenticationRouter from "./routes/authentication.js";
import raidRouter from "./routes/raids.js";
import aspectRouter from "./routes/aspects.js";
import tomeRouter from "./routes/tomes.js";
import waitlistRouter from "./routes/waitlist.js";
import modVersionRouter from "./routes/modVersion.js";
import "./sockets/discord.js";
import wynnRouter from "./routes/wynn.js";
import healthRouter from "./routes/healthCheck.js";
import userInfoRouter from "./routes/userInfo.js";
import getGuildId from "./middleware/getGuildId.middleware.js";
import registerDatabases from "./models/guildDatabaseModel.js";
import configRouter from "./routes/serverConfig.js";

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
try {
    const dbUrl = process.env.DB_URL;
    connect(dbUrl, { retryWrites: true, writeConcern: { w: "majority" } }).then(() => {
        registerDatabases();
        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
}

const guildRouter = Router();
const apiVersion = "v2";

app.use("/api/:version*", (request: Request<{ version: string }>, response: Response, next: NextFunction) => {
    if (request.params.version !== apiVersion) {
        response.status(301).send({ error: `please use /api/${apiVersion}` });
        return;
    }
    next();
});

app.use(`/api/${apiVersion}/config`, configRouter);
app.use(`/api/${apiVersion}/guilds`, guildRouter);

app.all("*", (_: Request, response: Response) => {
    response.status(404).send({ error: "not found" });
});

// Set guildId property on future requests
guildRouter.use(getGuildId);

// Map endpoints
guildRouter.use("/auth", authenticationRouter);
guildRouter.use("/user", userInfoRouter);
guildRouter.use("/wynn", wynnRouter);
guildRouter.use("/healthz", healthRouter);
guildRouter.use("/mod", modVersionRouter);
guildRouter.use("/raids", raidRouter);
guildRouter.use("/aspects", aspectRouter);
guildRouter.use("/tomes", tomeRouter);
guildRouter.use("/waitlist", waitlistRouter);
guildRouter.use(statusRouter);
