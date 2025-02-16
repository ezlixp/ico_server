import { NextFunction } from "express";
import { guildDatabases } from "../models/entities/guildDatabaseModel.js";
import { GuildRequest } from "../communication/requests/guildRequest.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import { ValidationError } from "../errors/implementations/validationError.js";

export default function verifyGuild(request: GuildRequest, response: DefaultResponse, next: NextFunction) {
    if (!(request.params.wynnGuildId in guildDatabases) && request.params.wynnGuildId !== "*") {
        throw new ValidationError("This guild is not configured. In order to configure a guild, contact a developer.");
    }
    next();
}
