import {Request, Router} from "express";
import {DefaultResponse} from "../types/responseTypes.js";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware.js";
import {GuildImpl, IGuild} from "../models/guildModel.js";
import {GuildDatabaseCreator} from "../services/guild/guildDatabaseCreator.js";
import {GuildRepository} from "../repositories/guildRepository.js";
import {AddGuildRequest} from "../communication/requests/addGuildRequest.js";
import {GuildService} from "../services/guild/guildService.js";

const adminRouter = Router();
const guildService = GuildService.create();

adminRouter.post(
    "/new-guild",
    validateAdminJwtToken,
    async (
        request: Request<{}, {}, AddGuildRequest>,
        response: DefaultResponse<IGuild>
    ) => {
        const guildObj = new GuildImpl(
            request.body.validationKey,
            request.body.wynnGuildId,
            request.body.wynnGuildName
        );

        const newGuild = await guildService.createNewGuild(guildObj);

        response.status(200).send(newGuild);
    }
);

export default adminRouter;
