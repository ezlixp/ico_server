import { Response, Router } from "express";
import { usernameToUuid, uuidToUsername } from "../../net/mojangApiClient.js";
import { guildDatabases } from "../../models/guildDatabaseModel.js";
import { GuildRequest } from "../../types/requestTypes.js";
import verifyInGuild from "../../middleware/verifyInGuild.middleware.js";
import validateJwtToken from "../../security/jwtTokenValidator.js";
import verifyGuild from "../../middleware/verifyGuild.middleware.js";

interface IRaidRewardsResponse {
    username: string;
    raids: number;
    aspects: number;
    emeralds: number;
}

/**
 * Maps all raid-related endpoints base route: /raids.
 */
const raidRouter = Router();

raidRouter.get("/:wynnGuildId", verifyGuild, async (request: GuildRequest, response: Response) => {
    try {
        const raids = await guildDatabases[request.params.wynnGuildId].RaidModel.find({});
        response.send(raids);

        console.log("GET:", raids);
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing the request." });
        console.error("getRaidsError:", error);
    }
});

raidRouter.get("/rewards/:wynnGuildId", verifyGuild, async (request: GuildRequest, response: Response) => {
    try {
        const users = await guildDatabases[request.params.wynnGuildId].GuildUserModel.find({
            $or: [{ aspects: { $gte: 1 } }, { emeralds: { $gt: 0 } }],
        }).exec();
        const res: IRaidRewardsResponse[] = [];
        await Promise.all([
            users.forEach(async (val) => {
                res.push({
                    username: await uuidToUsername(val.uuid),
                    raids: val.raids,
                    aspects: val.aspects,
                    emeralds: val.emeralds / 4096,
                });
            }),
        ]);
        response.send(res);
    } catch (error) {
        console.error("get rewards error:", error);
        response.status(500).send({ error: "Something went wrong processing the request." });
    }
});

raidRouter.post(
    "/rewards/:wynnGuildId",
    verifyGuild,
    validateJwtToken,
    verifyInGuild,
    async (
        request: GuildRequest<{}, {}, { username: string; aspects?: number; emeralds?: number }>,
        response: Response
    ) => {
        try {
            const user = await guildDatabases[request.params.wynnGuildId].GuildUserModel.findOne(
                { uuid: await usernameToUuid(request.body.username) },
                {},
                { upsert: true, new: true }
            ).exec();
            if (!user) {
                response.status(400).send({ error: "Could not find specified user." });
                return;
            }
            if (request.body.aspects) user.aspects += request.body.aspects;
            if (request.body.emeralds) user.emeralds += request.body.emeralds;

            await user.save();
            response.send(user);
        } catch (error) {
            console.error("post rewards error:", error);
            response.status(500).send({ error: "Something went wrong processing the request." });
        }
    }
);

raidRouter.get("/leaderboard/:wynnGuildId", verifyGuild, async (request: GuildRequest, response: Response) => {
    try {
        const topUsers = await guildDatabases[request.params.wynnGuildId].GuildUserModel.find({ raids: { $gt: 0 } })
            .sort({ raids: "descending" })
            .limit(10);
        let formattedTopUsers: { username: string; raids: number }[] = [];
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
});

export default raidRouter;
