import express, {NextFunction, Request, Response, Router} from "express";
import app, {server} from "./app.js";
import {connect} from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import "./config";
import "./sockets/discord.js";
import {registerMessageIndexes} from "./sockets/discord.js";
import {GuildDatabaseCreator} from "./services/guild/guildDatabaseCreator.js";
import {errorHandler} from "./middleware/errorHandler.middleware.js";
import {mapEndpoints} from "./services/endpointMapper.js";

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

// Connect to database
try {
    const dbUrl = process.env.DB_URL;
    connect(dbUrl, {retryWrites: true, writeConcern: {w: "majority"}}).then(() => {
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

mapEndpoints(app);
app.use(errorHandler);
