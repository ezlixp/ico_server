import { NextFunction, Response } from "express";
import checkIfPlayerIsGuildAsync from "../net/wynncraftApiClient.js";
import { GuildRequest } from "../communication/requests/guildRequest.js";

export default function verifyInGuild(
    request: GuildRequest<{}, {}, { username: string }>,
    response: Response,
    next: NextFunction
) {
    try {
        if (!request.body.username) {
            response.status(400).send({ error: "Username not provided." });
            return;
        }

        checkIfPlayerIsGuildAsync(request.body.username, request.params.wynnGuildId).then((res) => {
            // If provided player is in specified guild, continue
            if (res || request.params.wynnGuildId === "**") next();
            // Otherwise, return 'Bad Request'
            else response.status(400).send({ error: "User not in the guild." });
        });
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing your request." });
        console.error("check guild middleware error:", error);
    }
}
