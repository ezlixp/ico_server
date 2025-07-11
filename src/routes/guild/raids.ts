import { Router } from "express";
import { usernameToUuid } from "../../communication/httpClients/mojangApiClient";
import { GuildRequest } from "../../communication/requests/guildRequest";
import validateAdminJwtToken from "../../middleware/jwtAdminTokenValidator.middleware";
import { DefaultResponse } from "../../communication/responses/defaultResponse";
import { ILeaderboardUser, IRaid, IRaidRewardsResponse } from "../../models/schemas/raidSchema";
import { IGuildUser } from "../../models/schemas/guildUserSchema";
import { RaidService } from "../../services/guild/raidService";

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
        request: GuildRequest<{}, {}, { mcUsername: string; aspects?: number; emeralds?: number }>,
        response: DefaultResponse<IGuildUser>
    ) => {
        response.send(
            await raidService.updateRewards(
                { uuid: await usernameToUuid(request.body.mcUsername) },
                request.body.aspects || null,
                request.body.emeralds || null,
                request.params.wynnGuildId
            )
        );
    }
);

raidRouter.get(
    "/rewards/:wynnGuildId/:mcUsername",
    async (request: GuildRequest<{ mcUsername: string }>, response: DefaultResponse<IRaidRewardsResponse>) => {
        response.send(
            await raidService.getUserRewards(
                { uuid: await usernameToUuid(request.params.mcUsername) },
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
