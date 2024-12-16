import { NextFunction, Request, Response } from "express";
import checkIfPlayerIsGuildAsync from "../net/wynncraftApiClient.js";

export default function verifyGuild(
    guildId: string
): (request: Request<{}, {}, { username: string }>, response: Response, next: NextFunction) => void {
    return (request: Request<{}, {}, { username: string }>, response: Response, next: NextFunction) => {
        try {
            if (!request.body.username) {
                response.status(400).send({ error: "Username not provided." });
                return;
            }

            checkIfPlayerIsGuildAsync(request.body.username, guildId).then((res) => {
                // If provided player is in specified guild, continue
                if (res) next();
                // Otherwise, return 'Bad Request'
                else response.status(400).send({ error: "User not in the guild." });
            });
        } catch (error) {
            response.status(500).send({ error: "Something went wrong processing your request." });
            console.log("check guild middleware error:", error);
        }
    };
}
