import RaidModel from "../models/raidModel.js";
import UserModel from "../models/userModel.js";
import validateJwtToken from "../security/jwtTokenValidator.js";
import {Application, Request, Response} from "express";

interface RaidRequestBody {
    users: string[];
    raid: string;
    timestamp: number;
}

/**
 * Maps all raid-related endpoints.
 */
function mapRaidEndpoints(app: Application): void {
    app.get("/getRaids", async (request: Request, response: Response) => {
        try {
            const raids = await RaidModel.find({});
            response.status(200);
            response.send(raids);

            console.log("GET:", raids);
        } catch (error) {
            response.status(500);
            response.send("Something went wrong processing the request.");
            console.error("getRaidsError:", error);
        }
    });

    app.post("/addRaid", validateJwtToken, async (request: Request<{}, {}, RaidRequestBody>, response: Response) => {
        try {
            const {users, raid, timestamp} = request.body;

            const sortedUsers = users.sort((user1, user2) => user1.localeCompare(user2, "en", {sensitivity: "base"}));

            const newRaid = new RaidModel({
                users: sortedUsers,
                raid,
                timestamp,
            });

            // Gets last raid that the same team completed
            const lastRaid = await RaidModel.findOne({users: sortedUsers})
                .sort({timestamp: -1})
                .collation({locale: "en", strength: 2});

            // If there is a last raid and timestamp difference is < 10 seconds, return an error
            if (lastRaid && newRaid.timestamp.valueOf() - lastRaid.timestamp.valueOf() < 10000) {
                response.send({err: "duplicate raid"});
                return;
            }

            await newRaid.save();

            // Add users to db and increase aspect counter by 0.5
            await Promise.all(
                newRaid.users.map((username) => {
                    UserModel.updateOne(
                        {username: username},
                        {$inc: {aspects: 0.5}},
                        {upsert: true, collation: {locale: "en", strength: 2}}
                    ).then(() => console.log(username, "got 0.5 aspects"));
                })
            );
            response.send({err: ""});
        } catch (error) {
            response.status(500);
            response.send({err: "something went wrong"});

            console.error("postRaidError:", error);
        }
    });
}

export default mapRaidEndpoints;
