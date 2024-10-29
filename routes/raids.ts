import RaidModel from "../models/raidModel.js";
import { Request, Response, Router } from "express";
import UserModel from "../models/userModel.js";
import { UUIDtoUsername } from "../services/ConvertMinecraftUser.js";

/**
 * Maps all raid-related endpoints base route: /raids.
 */
const raidRouter = Router();

raidRouter.get("/", async (request: Request, response: Response) => {
    try {
        const raids = await RaidModel.find({});
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
        const topUsers = await UserModel.find({}).sort({ raids: "descending" }).limit(10);
        // TODO implement mojang api bulk uuid to username call
        for (let i = 0; i < topUsers.length; i++) {
            topUsers[i] = await topUsers[i]
                .$set({ username: await UUIDtoUsername(topUsers[i].uuid.toString()) })
                .save();
        }
        response.send(topUsers);
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing the request" });
        console.error("getRaidsLeaderboardError:", error);
    }
});

export default raidRouter;
