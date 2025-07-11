import { Request, Router } from "express";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import { AddGuildRequest } from "../communication/requests/addGuildRequest.js";
import Services from "../services/services.js";
import { GuildInfoImpl, IGuildInfo } from "../models/entities/guildInfoModel.js";

const adminRouter = Router();

adminRouter.post(
    "/new-guild",
    validateAdminJwtToken,
    async (request: Request<{}, {}, AddGuildRequest>, response: DefaultResponse<IGuildInfo>) => {
        const guildObj = new GuildInfoImpl(
            request.body.validationKey,
            request.body.wynnGuildId,
            request.body.wynnGuildName
        );

        const newGuild = await Services.guildInfo.createNewGuild(guildObj);

        response.status(200).send(newGuild);
    }
);

export default adminRouter;
