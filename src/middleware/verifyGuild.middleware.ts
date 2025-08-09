import { NextFunction } from "express";
import { guildDatabases } from "../models/entities/guildDatabaseModel";
import { GuildRequest } from "../communication/requests/guildRequest";
import { DefaultResponse } from "../communication/responses/defaultResponse";
import { ValidationError } from "../errors/implementations/validationError";

export default function verifyGuild(request: GuildRequest, response: DefaultResponse, next: NextFunction) {
    if (!(request.params.wynnGuildId in guildDatabases) && request.params.wynnGuildId !== "*") {
        throw new ValidationError("This guild is not configured. In order to configure a guild, contact a developer.");
    }
    next();
}
