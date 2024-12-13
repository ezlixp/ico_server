import { Request, Response, Router } from "express";
import { getOnlineUsers } from "../utils/socketUtils.js";

interface IOnlineUser {
    Id: number;
    Username: string;
}

/**
 * Maps all wynn related endpoints.
 */
const wynnRouter = Router();

wynnRouter.get("/online", async (request: Request, response: Response) => {
    response.send(getOnlineUsers());
});

export default wynnRouter;
