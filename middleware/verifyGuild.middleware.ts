import { NextFunction, Response } from "express";
import { GuildRequest } from "../communication/requests/guildRequest.js";
import { guildDatabases } from "../models/guildDatabaseModel.js";

export default function verifyGuild(request: GuildRequest, response: Response, next: NextFunction) {
    if (!(request.params.wynnGuildId in guildDatabases) && request.params.wynnGuildId !== "*") {
        response
            .status(400)
            .send({ error: "This guild is not configured. In order to configure a guild, contact a developer." });
        return;
    }
    next();
}
