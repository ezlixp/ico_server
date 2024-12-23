import { Request, Response, Router } from "express";
import { getOnlineUsers } from "../utils/socketUtils.js";

/**
 * Maps all wynn related endpoints.
 */
const wynnRouter = Router();

wynnRouter.get("/online", async (request: Request, response: Response) => {
    response.send(await getOnlineUsers(request.wynnGuildId!));
});

export default wynnRouter;
