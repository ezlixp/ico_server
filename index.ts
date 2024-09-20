import express, {Application} from "express";
import {connect} from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import mapRaidEndpoints from "./routes/raids.js";
import mapAuthenticationEndpoints from "./routes/authentication.js";
import "./config";
import mapAspectEndpoints from "./routes/aspects.js";
import mapTomeEndpoints from "./routes/tomes.js";
import mapWaitlistEndpoints from "./routes/waitlist.js";
import mapStatusEndpoints from "./routes/status.js";
import statusRouter from "./routes/status.js";
import authenticationRouter from "./routes/authentication.js";
import raidRouter from "./routes/raids.js";
import aspectRouter from "./routes/aspects.js";
import tomeRouter from "./routes/tomes.js";
import waitlistRouter from "./routes/waitlist.js";
import discordRouter from "./routes/discord.js";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

// Connect to database
try {
    const dbUrl: string = process.env.DB_URL as string;

    connect(dbUrl).then(() => {
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
}

// Map endpoints
app.use(statusRouter);
app.use("/auth", authenticationRouter);
app.use(raidRouter);
app.use(aspectRouter);
app.use(tomeRouter);
app.use(waitlistRouter);
app.use("/discord", discordRouter);
