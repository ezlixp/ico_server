import { NextFunction, Request, Router } from "express";
import validateJwtToken from "../middleware/jwtTokenValidator.middleware.js";
import ServerConfigModel, { IServerConfig } from "../models/entities/serverConfigModel.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware.js";
import { ValidationError } from "../errors/implementations/validationError.js";
import { DatabaseError } from "../errors/implementations/databaseError.js";
import { NotFoundError } from "../errors/implementations/notFoundError.js";

/**
 * Maps all server config related endpoints. request.wynnGuildId is NOT defined in these routes, but request.discordGuildId is.
 */
const configRouter = Router();
const serverConfigRouter = Router({ mergeParams: true });

// Register all middlewares.
configRouter.use(validateAdminJwtToken);
configRouter.use("/:discordGuildId", serverConfigRouter);

serverConfigRouter.use(validateJwtToken);
serverConfigRouter.use(
    async (request: Request<{ discordGuildId: string }, {}, {}>, response: DefaultResponse, next: NextFunction) => {
        const query = ServerConfigModel.findOne({ discordGuildId: request.params.discordGuildId });
        const server = await query.exec();
        if (!server) {
            throw new NotFoundError("Could not find specified server.");
        }
        request.discordGuildId = request.params.discordGuildId;
        request.serverConfig = server;
        next();
    }
);

configRouter.post(
    "/",
    async (
        request: Request<
            {},
            {},
            {
                discordGuildId: string;
                wynnGuildId: string;
                tomeChannel?: string;
                layoffsChannel?: string;
                raidsChannel?: string;
                warChannel?: string;
                privilegedRoles?: string[];
                listeningChannel?: string;
                broadcastingChannel?: string;
            }
        >,
        response: DefaultResponse<IServerConfig>
    ) => {
        const server = await ServerConfigModel.findOne()
            .or([{ discordGuildId: request.body.discordGuildId }, { wynnGuildId: request.body.wynnGuildId }])
            .exec();
        if (server) {
            throw new ValidationError("Configuration already set up for specified server or guild.");
        }
        const body = request.body;
        const newServer = new ServerConfigModel({
            discordGuildId: body.discordGuildId,
            wynnGuildId: body.wynnGuildId,
        });
        if (body.tomeChannel) newServer.tomeChannel = body.tomeChannel;
        if (body.layoffsChannel) newServer.layoffsChannel = body.layoffsChannel;
        if (body.raidsChannel) newServer.raidsChannel = body.raidsChannel;
        if (body.warChannel) newServer.warChannel = body.warChannel;
        if (body.broadcastingChannel) newServer.broadcastingChannel = body.broadcastingChannel;
        if (body.listeningChannel) newServer.listeningChannel = body.listeningChannel;
        if (body.privilegedRoles)
            await Promise.all([
                body.privilegedRoles.forEach((v) => {
                    newServer.privilegedRoles.push(v);
                }),
            ]);
        await newServer.save();
        response.send(newServer);
    }
);

serverConfigRouter.get("/", async (request: Request, response: DefaultResponse<IServerConfig>) => {
    response.send(request.serverConfig);
});

serverConfigRouter.delete("/", async (request: Request, response: DefaultResponse) => {
    await ServerConfigModel.findOneAndDelete({ discordGuildId: request.discordGuildId }).exec();
    response.status(204).send();
});

serverConfigRouter.patch(
    "/",
    async (
        request: Request<
            {},
            {},
            {
                tomeChannel?: string;
                layoffsChannel?: string;
                raidsChannel?: string;
                warChannel?: string;
                privilegedRoles?: string[];
                listeningChannel?: string;
                broadcastingChannel?: string;
            }
        >,
        response: DefaultResponse<IServerConfig>
    ) => {
        try {
            const body = request.body;
            if (body.tomeChannel) request.serverConfig!.tomeChannel = body.tomeChannel;
            if (body.layoffsChannel) request.serverConfig!.layoffsChannel = body.layoffsChannel;
            if (body.raidsChannel) request.serverConfig!.raidsChannel = body.raidsChannel;
            if (body.warChannel) request.serverConfig!.warChannel = body.warChannel;
            if (body.broadcastingChannel) request.serverConfig!.broadcastingChannel = body.broadcastingChannel;
            if (body.listeningChannel) request.serverConfig!.listeningChannel = body.listeningChannel;
            if (body.privilegedRoles)
                await Promise.all([
                    body.privilegedRoles.forEach((v) => {
                        request.serverConfig!.privilegedRoles.push(v);
                    }),
                ]);
            await request.serverConfig!.save();
            response.send(request.serverConfig);
        } catch (error) {
            console.error("patch server config error:", error);
            throw new DatabaseError();
        }
    }
);

// currently no validation for duplicate roles
serverConfigRouter.post(
    "/privileged-role",
    async (request: Request<{}, {}, { roleId: string }>, response: DefaultResponse<IServerConfig>) => {
        try {
            request.serverConfig!.privilegedRoles.push(request.body.roleId);
            await request.serverConfig!.save();
            response.send(request.serverConfig);
        } catch (error) {
            console.error("privileged role post error:", error);
            throw new DatabaseError();
        }
    }
);

serverConfigRouter.delete(
    "/privileged-role",
    async (request: Request<{}, {}, { roleId: string }>, response: DefaultResponse<IServerConfig>) => {
        try {
            const index = request.serverConfig!.privilegedRoles.indexOf(request.body.roleId);
            if (index === -1) {
                throw new ValidationError("Requested role was not privileged");
            }
            request.serverConfig!.privilegedRoles.splice(index, 1);
            await request.serverConfig?.save();
            response.send(request.serverConfig);
        } catch (error) {
            console.error("privileged role delete error:", error);
            throw new DatabaseError();
        }
    }
);

// serverConfigRouter.post("/invite", async (request: Request<{}, {}, { guildId: string }>, response: Response) => {
//     try {
//         if (request.body.guildId === request.serverConfig!.wynnGuildId) {
//             response.status(400).send({ error: "Cannot invite self." });
//             return;
//         }

//         const invited = await ServerConfigModel.findOne({ wynnGuildId: request.body.guildId }).exec();
//         if (!invited) {
//             response.status(404).send({ error: "Could not find specified guild server." });
//             return;
//         }

//         invited.invites.push(request.serverConfig!.wynnGuildId);
//         await invited.save();
//         request.serverConfig!.outgoingInvites.push(request.body.guildId);
//         await request.serverConfig!.save();

//         response.send(request.serverConfig);
//     } catch (error) {
//         console.error("post invite error:", error);
//         response.status(500).send({ error: "Something went wrong processing the request." });
//     }
// });

// serverConfigRouter.delete("/invite", async (request: Request<{}, {}, { guildId: string }>, response: Response) => {
//     try {
//         if (request.body.guildId === request.serverConfig!.wynnGuildId) {
//             response.status(400).send({ error: "Cannot invite self." });
//             return;
//         }

//         const invited = await ServerConfigModel.findOne({ wynnGuildId: request.body.guildId }).exec();
//         const myGuildId = request.serverConfig!.wynnGuildId;
//         if (!invited) {
//             response.status(404).send({ error: "Could not find specified guild server." });
//             return;
//         }
//         const myIndex = request.serverConfig!.outgoingInvites.indexOf(request.body.guildId);
//         const invitedIndex = invited.invites.indexOf(myGuildId);
//         if (myIndex === -1) {
//             response.status(404).send({ error: "Specified guild server was not invited." });
//         }
//         if (invitedIndex === -1) {
//             console.warn("two way invite broken for guild ids:", myGuildId, invited.wynnGuildId);
//         } else {
//             invited.invites.splice(invitedIndex, 1);
//         }
//         request.serverConfig!.outgoingInvites.splice(myIndex, 1);

//         await request.serverConfig!.save();
//         await invited.save();

//         response.send(request.serverConfig);
//     } catch (error) {
//         console.error("delete invite error:", error);
//         response.status(500).send({ error: "Something went wrong processing the request." });
//     }
// });

// // bot should do validation for channel id
// serverConfigRouter.post(
//     "/invite/accept",
//     async (request: Request<{}, {}, { guildId: string; channelId: number }>, response: Response) => {
//         try {
//             if (request.body.guildId === request.serverConfig!.wynnGuildId) {
//                 response.status(400).send({ error: "Cannot invite self." });
//                 return;
//             }

//             const guildId = request.body.guildId;
//             const channelId = request.body.channelId;
//             const inviter = await ServerConfigModel.findOne({ wynnGuildId: guildId }).exec();
//             if (!inviter) {
//                 response.status(404).send({ error: "Could not find specified guild." });
//                 return;
//             }
//             const index = request.serverConfig!.invites.indexOf(guildId);
//             const inviterIndex = inviter.outgoingInvites.indexOf(request.serverConfig!.wynnGuildId);
//             if (index === -1 || inviterIndex === -1) {
//                 response.status(404).send({ error: "Could not find invite." });
//                 return;
//             }
//             inviter.outgoingInvites.splice(inviterIndex, 1);
//             inviter.broadcastingChannels.push(channelId);
//             await inviter.save();

//             request.serverConfig!.invites.splice(index, 1);
//             request.serverConfig!.listeningChannel.push({ guildId: guildId, channelId: channelId });
//             await request.serverConfig!.save();

//             response.send(request.serverConfig);
//         } catch (error) {
//             console.error("accept invite error:", error);
//             response.status(500).send({ error: "Something went wrong processing the request." });
//         }
//     }
// );

// serverConfigRouter.post("/invite/reject", async (request: Request<{}, {}, { guildId: string }>, response: Response) => {
//     try {
//         if (request.body.guildId === request.serverConfig!.wynnGuildId) {
//             response.status(400).send({ error: "Cannot invite self." });
//             return;
//         }

//         const guildId = request.body.guildId;
//         const inviter = await ServerConfigModel.findOne({ wynnGuildId: guildId });
//         if (!inviter) {
//             response.status(404).send({ error: "Could not find specified guild." });
//             return;
//         }
//         const index = request.serverConfig!.invites.indexOf(guildId);
//         const inviterIndex = inviter.outgoingInvites.indexOf(request.serverConfig!.wynnGuildId);
//         if (index === -1 || inviterIndex === -1) {
//             response.status(404).send({ error: "Could not find invite." });
//             return;
//         }
//         inviter.outgoingInvites.splice(inviterIndex, 1);
//         await inviter.save();

//         request.serverConfig!.invites.splice(index, 1);
//         await request.serverConfig!.save();
//         response.status(204).send();
//     } catch (error) {
//         console.error("reject invite error:", error);
//         response.status(500).send({ error: "Something went wrong processing the request." });
//     }
// });

// TODO: add route for unlinking channels

export default configRouter;
