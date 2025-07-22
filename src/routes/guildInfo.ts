import { Request, Router } from "express";
import validateJwtToken from "../middleware/jwtTokenValidator.middleware";
import GuildInfoModel, { GuildInfoImpl, IGuildInfo, IGuildInfoOptionals } from "../models/entities/guildInfoModel";
import { DefaultResponse } from "../communication/responses/defaultResponse";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware";
import Services from "../services/services";
import { muteUser } from "../utils/socketUtils";

interface InfoRequest<Params = Record<string, any>, ResBody = any, ReqBody = any, ReqQuery = any>
    extends Request<Params & { discordGuildId: string }, ResBody, ReqBody, ReqQuery> {}
/**
 * Maps all server config related endpoints. request.wynnGuildId is NOT defined in these routes, but request.discordGuildId is.
 */
const infoRouter = Router();
const guildInfoRouter = Router({ mergeParams: true });

// Register all middlewares.
infoRouter.use(validateAdminJwtToken);
infoRouter.use("/:discordGuildId", guildInfoRouter);

guildInfoRouter.use(validateJwtToken);

infoRouter.post("/", async (request: InfoRequest<{}, {}, IGuildInfo>, response: DefaultResponse<IGuildInfo>) => {
    Services.guildInfo.checkDuplicateGuild(request.body.discordGuildId, request.body.wynnGuildId);

    const body = request.body;
    const newServer = new GuildInfoImpl(body.wynnGuildId, body.wynnGuildName, body.discordGuildId, body);
    const newServerModel = new GuildInfoModel(newServer);

    await newServerModel.save();

    response.send(newServerModel);
});

guildInfoRouter.get("/", async (request: InfoRequest, response: DefaultResponse<IGuildInfo>) => {
    response.send(await Services.guildInfo.getGuildByDiscord(request.params.discordGuildId));
});

guildInfoRouter.delete("/", async (request: InfoRequest, response: DefaultResponse) => {
    await Services.guildInfo.deleteGuild({ discordGuildId: request.params.discordGuildId });
    response.status(204).send();
});

guildInfoRouter.patch(
    "/",
    async (request: InfoRequest<{}, {}, IGuildInfoOptionals>, response: DefaultResponse<IGuildInfo>) => {
        response.send(await Services.guildInfo.updateGuildInfo(request.params.discordGuildId, request.body));
    }
);

// currently no validation for duplicate roles
guildInfoRouter.post(
    "/privileged-role",
    async (request: InfoRequest<{}, {}, { roleId: string }>, response: DefaultResponse<IGuildInfo>) => {
        response.send(
            await Services.guildInfo.updateGuildInfo(request.params.discordGuildId, {
                privilegedRoles: [request.body.roleId],
            })
        );
    }
);

guildInfoRouter.delete(
    "/privileged-role",
    async (request: InfoRequest<{}, {}, { roleId: string }>, response: DefaultResponse<IGuildInfo>) => {
        const res = await Services.guildInfo.updateGuildInfo(request.params.discordGuildId, {
            $pull: { privilegedRoles: request.body.roleId },
        });
        response.send(res);
    }
);

guildInfoRouter.post(
    "/mute",
    async (
        request: InfoRequest<{}, {}, { discordUuid: string; muted: boolean }>,
        response: DefaultResponse<IGuildInfo>
    ) => {
        muteUser(request.body.discordUuid, request.body.muted);
        if (request.body.muted) {
            response.send(
                await Services.guildInfo.updateGuildInfo(request.params.discordGuildId, {
                    $push: { mutedUuids: request.body.discordUuid },
                })
            );
        } else {
            response.send(
                await Services.guildInfo.updateGuildInfo(request.params.discordGuildId, {
                    $pull: { mutedUuids: request.body.discordUuid },
                })
            );
        }
    }
);

export default infoRouter;
