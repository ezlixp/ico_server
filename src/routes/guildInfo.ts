import { NextFunction, Request, Router } from "express";
import validateJwtToken from "../middleware/jwtTokenValidator.middleware";
import GuildInfoModel, { GuildInfoImpl, IGuildInfo, IGuildInfoOptionals } from "../models/entities/guildInfoModel";
import { DefaultResponse } from "../communication/responses/defaultResponse";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware";
import { ValidationError } from "../errors/implementations/validationError";
import { DatabaseError } from "../errors/implementations/databaseError";
import { NotFoundError } from "../errors/implementations/notFoundError";
import Services from "../services/services";
import { HydratedDocument } from "mongoose";

interface InfoRequest<Params = Record<string, any>, ResBody = any, ReqBody = any, ReqQuery = any>
    extends Request<Params, ResBody, ReqBody, ReqQuery> {
    discordGuildId?: string;
    guildInfo?: HydratedDocument<IGuildInfo>;
}
/**
 * Maps all server config related endpoints. request.wynnGuildId is NOT defined in these routes, but request.discordGuildId is.
 */
const infoRouter = Router();
const guildInfoRouter = Router({ mergeParams: true });

// Register all middlewares.
infoRouter.use(validateAdminJwtToken);
infoRouter.use("/:discordGuildId", guildInfoRouter);

guildInfoRouter.use(validateJwtToken);
guildInfoRouter.use(
    async (request: InfoRequest<{ discordGuildId: string }, {}, {}>, response: DefaultResponse, next: NextFunction) => {
        const query = GuildInfoModel.findOne({ discordGuildId: request.params.discordGuildId });
        const server = await query.exec();
        if (!server) {
            throw new NotFoundError("Could not find specified server.");
        }
        request.discordGuildId = request.params.discordGuildId;
        request.guildInfo = server;
        next();
    }
);

infoRouter.post("/", async (request: InfoRequest<{}, {}, IGuildInfo>, response: DefaultResponse<IGuildInfo>) => {
    Services.guildInfo.validateNewGuildCreation(request.body.discordGuildId, request.body.wynnGuildId);
    const body = request.body;
    const newServer = new GuildInfoImpl(body.wynnGuildId, body.wynnGuildName, body.discordGuildId, body);
    const newServerModel = new GuildInfoModel(newServer);
    await newServerModel.save();
    response.send(newServerModel);
});

guildInfoRouter.get("/", async (request: InfoRequest, response: DefaultResponse<IGuildInfo>) => {
    response.send(request.guildInfo);
});

guildInfoRouter.delete("/", async (request: InfoRequest, response: DefaultResponse) => {
    await GuildInfoModel.findOneAndDelete({ discordGuildId: request.discordGuildId }).exec();
    response.status(204).send();
});

guildInfoRouter.patch(
    "/",
    async (request: InfoRequest<{}, {}, IGuildInfoOptionals>, response: DefaultResponse<IGuildInfo>) => {
        response.send(await Services.guildInfo.upsertGuildInfo(request.guildInfo!, request.body));
    }
);

// currently no validation for duplicate roles
guildInfoRouter.post(
    "/privileged-role",
    async (request: InfoRequest<{}, {}, { roleId: string }>, response: DefaultResponse<IGuildInfo>) => {
        try {
            request.guildInfo!.privilegedRoles!.push(request.body.roleId);
            await request.guildInfo!.save();
            response.send(request.guildInfo);
        } catch (error) {
            console.error("privileged role post error:", error);
            throw new DatabaseError();
        }
    }
);

guildInfoRouter.delete(
    "/privileged-role",
    async (request: InfoRequest<{}, {}, { roleId: string }>, response: DefaultResponse<IGuildInfo>) => {
        try {
            const index = request.guildInfo!.privilegedRoles!.indexOf(request.body.roleId);
            if (index === -1) {
                throw new ValidationError("Requested role was not privileged");
            }
            request.guildInfo!.privilegedRoles!.splice(index, 1);
            await request.guildInfo?.save();
            response.send(request.guildInfo);
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

export default infoRouter;
