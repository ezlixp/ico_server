import { Response, Router } from "express";
import { GuildRequest } from "../../types/requestTypes.js";
import { getOnlineUsers } from "../../utils/socketUtils.js";
import verifyGuild from "../../middleware/verifyGuild.middleware.js";

/**
 * Maps all wynn related endpoints.
 */
const onlineRouter = Router();

onlineRouter.get("/:wynnGuildId", verifyGuild, async (request: GuildRequest, response: Response) => {
    response.send(await getOnlineUsers(request.params.wynnGuildId));
});

export default onlineRouter;
