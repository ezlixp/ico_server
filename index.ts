import express, { Request, Response, Router } from "express";
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

const router = Router({ mergeParams: true });

app.use(`/api/${process.env.npm_package_version}/config`, configRouter);
app.use(`/api/${process.env.npm_package_version}/:wynnGuildId`, router);

app.all(/\/api\/v[^2]/, (_: Request, response: Response) => {
    response.status(301).send({ error: `please use /api/${process.env.npm_package_version}` });
});
app.all("*", (_: Request, response: Response) => {
    response.status(404).send({ error: "not found" });
});

// Set guildId property on future requests
router.use(getGuildId);

// Map endpoints
router.use("/auth", authenticationRouter);
router.use("/user", userInfoRouter);
router.use("/wynn", wynnRouter);
router.use("/healthz", healthRouter);
router.use("/mod", modVersionRouter);
router.use("/raids", raidRouter);
router.use("/aspects", aspectRouter);
router.use("/tomes", tomeRouter);
router.use("/waitlist", waitlistRouter);
router.use(statusRouter);
