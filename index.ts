import express, { Router } from "express";
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

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
try {
    const dbUrl: string = process.env.DB_URL as string;

    connect(dbUrl).then(() => {
        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
}

const router = Router();
app.use("/api/v1", router);
// Map endpoints
router.use("/auth", authenticationRouter);
router.use("/user", userInfoRouter);
router.use("/wynn", wynnRouter);
router.use("/healthz", healthRouter);
router.use("/mod", modVersionRouter);
router.use("/raids", statusRouter);
router.use(raidRouter);
router.use(aspectRouter);
router.use(tomeRouter);
router.use(waitlistRouter);
