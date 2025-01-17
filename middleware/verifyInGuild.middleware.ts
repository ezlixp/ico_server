import { NextFunction, Response } from "express";
import checkIfPlayerIsGuildAsync from "../net/wynncraftApiClient.js";
import { GuildRequest } from "../communication/requests/guildRequest.js";

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

    if (await playerIsInGuild(username, wynnGuildId)) {
        if (request.params.wynnGuildId === "**")
            next();

        else
            throw new GuildVerificationError("User not in the guild.");
    }
}
