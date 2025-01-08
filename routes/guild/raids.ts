import { Router } from "express";
import { usernameToUuid, uuidToUsername } from "../../net/mojangApiClient.js";
import { guildDatabases } from "../../models/guildDatabaseModel.js";
import { GuildRequest } from "../../communication/requests/guildRequest.js";
import verifyGuild from "../../middleware/verifyGuild.middleware.js";
import validateAdminJwtToken from "../../middleware/jwtAdminTokenValidator.middleware.js";
import { DefaultResponse } from "../../communication/responses/defaultResponse.js";
import { IRaid } from "../../models/schemas/raidSchema.js";
import { IGuildUser } from "../../models/schemas/guildUserSchema.js";

interface IRaidRewardsResponse {
    username: string;
    raids: number;
    aspects: number;
    liquidEmeralds: number;
}

interface ILeaderboardUser {
    username: string;
    raids: number;
}

/**
 * Maps all raid-related endpoints base route: /raids.
 */
const raidRouter = Router();

raidRouter.get("/:wynnGuildId", verifyGuild, async (request: GuildRequest, response: DefaultResponse<IRaid[]>) => {
    try {
        const raids = await guildDatabases[request.params.wynnGuildId].RaidModel.find();
        response.send(raids);

        console.log("GET:", raids);
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing the request." });
        console.error("getRaidsError:", error);
    }
});

raidRouter.get(
    "/rewards/:wynnGuildId",
    verifyGuild,
    async (request: GuildRequest, response: DefaultResponse<IRaidRewardsResponse[]>) => {
        try {
            const users = await guildDatabases[request.params.wynnGuildId].GuildUserModel.find({
                $or: [{ aspects: { $gte: 1 } }, { emeralds: { $gt: 0 } }],
            }).exec();
            const res: IRaidRewardsResponse[] = [];
            for (var i = 0; i < users.length; ++i) {
                res.push({
                    username: await uuidToUsername(users[i].uuid),
                    raids: users[i].raids,
                    aspects: users[i].aspects,
                    liquidEmeralds: users[i].emeralds / 4096,
                });
            }
            response.send(res);
        } catch (error) {
            console.error("get rewards error:", error);
            response.status(500).send({ error: "Something went wrong processing the request." });
        }
    }
);

raidRouter.post(
    "/rewards/:wynnGuildId",
    verifyGuild,
    validateAdminJwtToken,
    async (
        request: GuildRequest<{}, {}, { username: string; aspects?: number; emeralds?: number }>,
        response: DefaultResponse<IGuildUser>
    ) => {
        try {
            console.log(request.body);
            const user = await guildDatabases[request.params.wynnGuildId].GuildUserModel.findOneAndUpdate({
                uuid: await usernameToUuid(request.body.username),
            }).exec();
            console.log(user);
            if (!user) {
                response.status(400).send({ error: "Could not find specified user." });
                return;
            }
            if (request.body.aspects) user.aspects -= request.body.aspects;
            if (request.body.emeralds) user.emeralds -= request.body.emeralds;

            await user.save();
            response.send(user);
        } catch (error) {
            console.error("post rewards error:", error);
            response.status(500).send({ error: "Something went wrong processing the request." });
        }
    }
);

raidRouter.get(
    "/rewards/:wynnGuildId/:username",
    verifyGuild,
    async (request: GuildRequest<{ username: string }>, response: DefaultResponse<IRaidRewardsResponse>) => {
        try {
            const user = await guildDatabases[request.params.wynnGuildId].GuildUserModel.findOne({
                uuid: await usernameToUuid(request.params.username),
            }).exec();
            if (!user) {
                response.status(404).send({ error: "Specified user could not be found in raid rewards list." });
                return;
            }
            const res: IRaidRewardsResponse = {
                username: request.params.username,
                raids: user.raids,
                aspects: user.aspects,
                liquidEmeralds: user.emeralds / 4096,
            };
            console.log(user);
            response.send(res);
        } catch (error) {
            console.error("get rewards error:", error);
            response.status(500).send({ error: "Something went wrong processing the request." });
        }
    }
);

raidRouter.get(
    "/leaderboard/:wynnGuildId",
    verifyGuild,
    async (request: GuildRequest, response: DefaultResponse<ILeaderboardUser[]>) => {
        try {
            const topUsers = await guildDatabases[request.params.wynnGuildId].GuildUserModel.find({ raids: { $gt: 0 } })
                .sort({ raids: "descending" })
                .limit(10);
            let formattedTopUsers: ILeaderboardUser[] = [];
            // TODO implement mojang api bulk uuid to username call
            for (let i = 0; i < topUsers.length; i++) {
                const topUser = await topUsers[i]
                    .$set({ username: await uuidToUsername(topUsers[i].uuid.toString()) })
                    .save();
                formattedTopUsers.push({
                    username: await uuidToUsername(topUser.uuid.toString()),
                    raids: topUser.raids.valueOf(),
                });
            }
            response.send(formattedTopUsers);
        } catch (error) {
            response.status(500).send({ error: "Something went wrong processing the request" });
            console.error("getRaidsLeaderboardError:", error);
        }
    }
);

export default raidRouter;
