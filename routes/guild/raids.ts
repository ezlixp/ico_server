import { Router } from "express";
import { usernameToUuid } from "../../net/mojangApiClient.js";
import { GuildRequest } from "../../communication/requests/guildRequest.js";
import validateAdminJwtToken from "../../middleware/jwtAdminTokenValidator.middleware.js";
import { DefaultResponse } from "../../communication/responses/defaultResponse.js";
import { ILeaderboardUser, IRaid, IRaidRewardsResponse } from "../../models/schemas/raidSchema.js";
import { IGuildUser } from "../../models/schemas/guildUserSchema.js";
import { RaidService } from "../../services/guild/raidService.js";

/**
 * Maps all raid-related endpoints base route: /raids.
 */
const raidRouter = Router();
const raidService = RaidService.create();

raidRouter.get("/:wynnGuildId", async (request: GuildRequest, response: DefaultResponse<IRaid[]>) => {
    response.send(await raidService.getRaids(request.params.wynnGuildId));
});

raidRouter.get(
    "/rewards/:wynnGuildId",
    async (request: GuildRequest, response: DefaultResponse<IRaidRewardsResponse[]>) => {
        response.send(await raidService.getRewards(request.params.wynnGuildId));
    }
);

raidRouter.post(
    "/rewards/:wynnGuildId",
    validateAdminJwtToken,
    async (
        request: GuildRequest<{}, {}, { username: string; aspects?: number; emeralds?: number }>,
        response: DefaultResponse<IGuildUser>
    ) => {
        response.send(
            await raidService.updateRewards(
                { uuid: await usernameToUuid(request.body.username) },
                request.body.aspects || null,
                request.body.emeralds || null,
                request.params.wynnGuildId
            )
        );
    }
);

raidRouter.get(
    "/rewards/:wynnGuildId/:username",
    async (request: GuildRequest<{ username: string }>, response: DefaultResponse<IRaidRewardsResponse>) => {
        response.send(
            await raidService.getUserRewards(
                { uuid: await usernameToUuid(request.params.username) },
                request.params.wynnGuildId
            )
        );
    }
);

raidRouter.get(
    "/leaderboard/:wynnGuildId",
    async (request: GuildRequest, response: DefaultResponse<ILeaderboardUser[]>) => {
        response.send(await raidService.getRaidsLeaderboard(request.params.wynnGuildId));
    }
);

export default raidRouter;
