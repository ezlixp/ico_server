import { Request, Response, Router } from "express";
import UserModel from "../models/userModel.js";
import validateJwtToken from "../security/jwtTokenValidator.js";
import express from "express";
import app from "../app.js";
import expressWs from "express-ws";
let messageIndex = 0;

type aspectEventArgs = {
    player: string;
};

// io.of("/aspects").on("connection", (socket) => {
//     console.log(socket.id);
//     socket.data.messageIndex = messageIndex;
//     socket.on("give_aspect", async (args: aspectEventArgs) => {
//         if (socket.data.messageIndex === messageIndex) {
//             ++messageIndex;
//             ++socket.data.messageIndex;
//             console.log(args.player, messageIndex);
//             UserModel.updateOne(
//                 { username: args.player },
//                 { $inc: { aspects: -1 } },
//                 {
//                     upsert: true,
//                     collation: { locale: "en", strength: 2 },
//                 }
//             ).then(() => {
//                 console.log(args.player, "received an aspect");
//             });
//         } else {
//             ++socket.data.messageIndex;
//             if (socket.data.messageIndex < messageIndex - 10) socket.data.messageIndex = messageIndex;
//         }
//     });
//     socket.on("sync", () => {
//         socket.data.messageIndex = messageIndex;
//     });
//     socket.on("debug_index", () => {
//         console.log(socket.data.messageIndex);
//     });
// });

/**
 * Maps websocket for aspect route
 * Note that this can be on aspect router as well, but it is split
 * so that the middleware can be excluded from routes in aspect router
 */
expressWs(app);
const aspectSocketRouter = Router();
// aspectSocketRouter.use(validateJwtToken);
// TODO: figure out authentication for websockets

aspectSocketRouter.ws("/aspects", (ws, req) => {
    console.log("on");
    ws.on("message", (args) => {
        console.log(args);
    });
});

/**
 * Maps all aspect-related endpoints.
 */
const aspectRouter = Router();

aspectRouter.get("/aspects", async (request: Request, response: Response) => {
    try {
        // Get 10 users with the highest aspect count
        const aspects = await UserModel.find({}).sort({ aspects: -1 }).limit(10);

        response.send(aspects);

        console.log("GET:", aspects);
    } catch (error) {
        response.status(500);
        response.send("Something went wrong processing the request.");
        console.error("getAspectsError:", error);
    }
});

aspectRouter.post("/aspects", validateJwtToken, async (request: Request, response: Response) => {
    try {
        const updatePromises = request.body.users.map((username: string) => {
            UserModel.updateOne(
                { username: username },
                { $inc: { aspects: -1 } },
                {
                    upsert: true,
                    collation: { locale: "en", strength: 2 },
                }
            ).then(() => {
                console.log(username, "received an aspect");
            });
        });
        await Promise.all(updatePromises);
        response.send({ err: "" });
    } catch (error) {
        response.status(500);
        response.send({ err: "something went wrong" });
        console.error("giveAspectError:", error);
    }
});

export { aspectSocketRouter as socketRouter };
export default aspectRouter;
