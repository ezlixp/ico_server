import { Router } from "express";
import { GuildRequest } from "../../communication/requests/guildRequest.js";
import { getOnlineUsers, IOnlineUser } from "../../utils/socketUtils.js";
import verifyGuild from "../../middleware/verifyGuild.middleware.js";
import { DefaultResponse } from "../../communication/responses/defaultResponse.js";

/**
 * Maps all wynn related endpoints.
 */
const onlineRouter = Router();

onlineRouter.get(
    "/:wynnGuildId",
    verifyGuild,
    async (request: GuildRequest, response: DefaultResponse<IOnlineUser[]>) => {
        response.send(await getOnlineUsers(request.params.wynnGuildId));
    }
);

export default onlineRouter;
