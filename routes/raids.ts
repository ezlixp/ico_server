import { Request, Response, Router } from "express";
import { uuidToUsername } from "../net/mojangApiClient.js";
import { guildDatabases } from "../models/guildDatabaseModel.js";

/**
 * Maps all raid-related endpoints base route: /raids.
 */
const raidRouter = Router();

raidRouter.get("/", async (request: Request, response: Response) => {
    try {
        const raids = await guildDatabases[request.guildId].RaidModel.find({});
        response.status(200);
        response.send(raids);

        console.log("GET:", raids);
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing the request." });
        console.error("getRaidsError:", error);
    }
});

raidRouter.get("/leaderboard", async (request: Request, response: Response) => {
    try {
        const topUsers = await guildDatabases[request.guildId].GuildUserModel.find({ raids: { $gt: 0 } })
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
