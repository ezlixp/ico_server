import RaidModel from "../models/raidModel.js";
import UserModel from "../models/userModel.js";
import validateJwtToken from "../security/jwtTokenValidator.js";
import { Application, Request, Response } from "express";

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

    app.post(
        "/addRaid",
        validateJwtToken,
        async (
            request: Request<{}, {}, RaidRequestBody>,
            response: Response
        ) => {
            try {
                const newUsers = request.body.users.sort((user1, user2) => {
                    return user1
                        .toLowerCase()
                        .localeCompare(user2.toLowerCase());
                });
                const newRaid = new RaidModel({
                    users: newUsers,
                    raid: request.body.raid,
                    timestamp: request.body.timestamp,
                });

                // Gets last raid that the same team completed
                const lastRaid = await RaidModel.findOne(
                    { users: newUsers },
                    null,
                    {
                        sort: { timestamp: -1 },
                    }
                ).collation({ locale: "en", strength: 2 });

                if (lastRaid == null) {
                    await newRaid.save();
                    // Add users to db and increase aspect counter by 0.5
                    await Promise.all(
                        newRaid.users.map((username) => {
                            UserModel.updateOne(
                                { username: username },
                                { $inc: { aspects: 0.5 } },
                                {
                                    upsert: true,
                                    collation: {
                                        locale: "en",
                                        strength: 2,
                                    },
                                }
                            ).then(() => {
                                console.log(username, "got 0.5 aspects");
                            });
                        })
                    );
                    response.send({ err: "" });
                } else {
                    // If the last raid was registered less
                    // than 10 seconds ago and it's players
                    // are the same as this one, then it's
                    // likely to be the same raid.
                    const timeDiff =
                        newRaid.timestamp.valueOf() -
                        lastRaid.timestamp.valueOf();

                    if (timeDiff < 10000) {
                        response.send({ err: "duplicate raid" });
                        return;
                    }

                    await newRaid.save();
                    // Add users to db and increase aspect counter by 0.5
                    await Promise.all(
                        newRaid.users.map((username) => {
                            UserModel.updateOne(
                                { username: username },
                                { $inc: { aspects: 0.5 } },
                                { upsert: true }
                            )
                                .collation({ locale: "en", strength: 2 })
                                .then(() => {
                                    console.log(username, "got 0.5 aspects");
                                });
                        })
                    );
                    response.send({ err: "" });
                }
            } catch (error) {
                response.status(500);
                response.send({ err: "something went wrong" });

                console.error("postRaidError:", error);
            }
        }
    );
}

export default mapRaidEndpoints;
