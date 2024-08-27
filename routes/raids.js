import RaidModel from "../models/raidModel.js";
import validateJwtToken from "../security/jwtTokenValidator.js";

function mapRaidEndpoints(app) {
    app.get("/getRaids", validateJwtToken, async (request, response) => {
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

    app.post("/addRaid", validateJwtToken, async (request, response) => {
        const newRaid = new RaidModel(request.body);

        try {
            // Gets newest raid registered
            let lastRaid = null;
            await RaidModel.findOne({}, null, {sort: {timestamp: -1}}).then((res) => {
                lastRaid = res;
            });

            if (lastRaid == null) {
                await newRaid.save().then(() => {
                    response.send({err: ""});
                });
            } else {
                const isSameUsers = (users1, users2) => {
                    users1.sort();
                    users2.sort();

                    return users1.every((user) => users2.includes(user));
                };

                // If the last raid was registered less
                // than 10 seconds ago and it's players
                // are the same as this one, then it's
                // likely to be the same raid.
                const timeDiff = Math.abs(newRaid.timestamp - lastRaid.timestamp);
                if (timeDiff < 10000 && isSameUsers(lastRaid.users, newRaid.users)) {
                    response.send({err: "duplicate raid"});
                    return;
                }

                await newRaid.save().then(() => {
                    response.send({err: ""});
                });
            }
        } catch (error) {
            response.send({err: "something went wrong"});

            console.error("postRaidError:", error);
        }
    });
}

export default mapRaidEndpoints;
