import { NextFunction, Response } from "express";
import { GuildRequest } from "../communication/requests/guildRequest";
import { GuildVerificationError } from "../errors/implementations/guildVerificationError";
import checkIfPlayerIsInGuildAsync from "../communication/httpClients/wynncraftApiClient";

export default async function verifyInGuild(
    request: GuildRequest<{}, {}, { mcUsername: string }>,
    response: Response,
    next: NextFunction
) {
    if (request.params.wynnGuildId === "**" || request.params.wynnGuildId === "*") return next();
    if (!request.body.mcUsername) throw new GuildVerificationError("Username not provided.");

    const mcUsername = request.body.mcUsername;
    const wynnGuildId = request.params.wynnGuildId;

    if (await checkIfPlayerIsInGuildAsync(mcUsername, wynnGuildId)) next();
    else throw new GuildVerificationError("User not in the guild.");
}
