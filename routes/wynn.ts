import { Request, Response, Router } from "express";
import { io } from "../app.js";

interface IOnlineUser {
    Id: number;
    Username: string;
}

/**
 * Maps all wynn related endpoints.
 */
const wynnRouter = Router();

wynnRouter.get("/online", async (request: Request, response: Response) => {
    const out: IOnlineUser[] = [];
    const sockets = await io.of("/discord").fetchSockets();
    sockets.forEach((socket) => {
        if (socket.data.username) out.push({ Id: out.length, Username: socket.data.username });
    });
    response.send(out);
});

export default wynnRouter;
