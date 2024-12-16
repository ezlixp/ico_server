import { NextFunction, Request, Response } from "express";

export default function getGuildId(
    request: Request<{ guildId: string | undefined }, {}, {}>,
    response: Response,
    next: NextFunction
) {
    request.guildId = request.params.guildId || "b250f587-ab5e-48cd-bf90-71e65d6dc9e7";
    next();
}
