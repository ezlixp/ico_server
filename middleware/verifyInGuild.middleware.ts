import { NextFunction, Response } from "express";
import { GuildRequest } from "../communication/requests/guildRequest.js";
import {GuildVerificationError} from "../errors/implementations/guildVerificationError.js";
import checkIfPlayerIsInGuildAsync from "../net/wynncraftApiClient.js";

export default async function verifyInGuild(
    request: GuildRequest<{}, {}, { username: string }>,
    response: Response,
    next: NextFunction
) {
    if (!request.body.username) {
        throw new GuildVerificationError("Username not provided.");
    }

    const username = request.body.username;
    const wynnGuildId = request.params.wynnGuildId;

    if (await checkIfPlayerIsInGuildAsync(username, wynnGuildId)) {
        if (request.params.wynnGuildId === "**")
            next();

        else
            throw new GuildVerificationError("User not in the guild.");
    }
}
