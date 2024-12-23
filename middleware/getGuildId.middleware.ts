import { NextFunction, Request, Response } from "express";

export default function getGuildId(
    request: Request<{ wynnGuildId: string }, {}, {}>,
    response: Response,
    next: NextFunction
) {
    request.wynnGuildId = request.params.wynnGuildId;
    next();
}
