import { Request, Response, Router } from "express";
import { io } from "../app.js";

/**
 * Maps all wynn related endpoints.
 */
const wynnRouter = Router();

wynnRouter.get("/online", async (request: Request, response: Response) => {
    const out: string[] = [];
    const sockets = await io.of("/discord").fetchSockets();
    sockets.forEach((socket) => {
        if (socket.data.username) out.push(socket.data.username);
    });
    response.send(out);
});

export default wynnRouter;
