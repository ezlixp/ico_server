import { NextFunction, Request, Response } from "express";

export default function getGuildId(
    request: Request<{ guildId: string }, {}, {}>,
    response: Response,
    next: NextFunction
) {
    request.guildId = request.params.guildId;
    next();
}
