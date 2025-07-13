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

guildInfoRouter.post(
    "/mute",
    async (request: InfoRequest<{}, {}, { discordUuid: string }>, response: DefaultResponse<IGuildInfo>) => {}
);

export default infoRouter;
