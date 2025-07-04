import { Request, Router } from "express";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import { GuildImpl, IGuild } from "../models/entities/guildModel.js";
import { AddGuildRequest } from "../communication/requests/addGuildRequest.js";
import Services from "../services/services.js";

const adminRouter = Router();

adminRouter.post(
    "/new-guild",
    validateAdminJwtToken,
    async (request: Request<{}, {}, AddGuildRequest>, response: DefaultResponse<IGuild>) => {
        const guildObj = new GuildImpl(
            request.body.validationKey,
            request.body.wynnGuildId,
            request.body.wynnGuildName
        );

        const newGuild = await Services.guild.createNewGuild(guildObj);

        response.status(200).send(newGuild);
    }
);

export default adminRouter;
