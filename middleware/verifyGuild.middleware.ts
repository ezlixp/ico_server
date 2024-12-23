import { NextFunction, Request, Response } from "express";
import checkIfPlayerIsGuildAsync from "../net/wynncraftApiClient.js";

export default function verifyGuild(
    request: Request<{}, {}, { username: string }>,
    response: Response,
    next: NextFunction
) {
    try {
        if (!request.body.username) {
            response.status(400).send({ error: "Username not provided." });
            return;
        }

        checkIfPlayerIsGuildAsync(request.body.username, request.wynnGuildId!).then((res) => {
            // If provided player is in specified guild, continue
            if (res || request.wynnGuildId === "**") next();
            // Otherwise, return 'Bad Request'
            else response.status(400).send({ error: "User not in the guild." });
        });
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing your request." });
        console.error("check guild middleware error:", error);
    }
}
