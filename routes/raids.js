import RaidModel from "../models/raidModel.js";

function mapRaidEndpoints(app) {
    app.get("/getRaids", async (request, response) => {
        try {
            const raids = await RaidModel.find({});
            response.statusCode(200).send(raids);

            console.log("GET:", raids);
        } catch (error) {
            response.statusCode(500).send("Something went wrong processing the request.");
            console.error("getRaidsError:", error);
        }
    });

    app.post("/addRaid", async (request, response) => {
        const newRaid = new RaidModel(request.body);

        try {
            // Gets newest raid registered
            const lastRaid = await RaidModel.findOne().sort({timestamp: -1});

            const isSameUsers = (users1, users2) => {
                users1.sort();
                users2.sort();

                return users1.every(user => users2.includes(user));
            }

            // If the last raid was registered less
            // than 10 seconds ago and it's players
            // are the same as this one, then it's
            // likely to be the same raid. 
            const timeDiff = newRaid.timestamp - lastRaid.timestamp;
            if (timeDiff < 10000 && isSameUsers()) return;

            await newRaid.save();
            response.send({err: ""});

        } catch (error) {
            response.send({err: "something went wrong"});

            console.error("postRaidError:", error);
        }
    });
}

export default mapRaidEndpoints;