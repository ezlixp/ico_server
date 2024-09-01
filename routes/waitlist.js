import WaitlistModel from "../models/waitlistModel.js";
import TomeModel from "../../../../../Code/ico_server_public/models/tomeModel.js";

/**
 * Maps all tome-related endpoints
 * @param {Express} app
 */
function mapWaitlistEndpoints(app) {
    app.get("/waitlist", async (request, response) => {
        try {
            // Get users sorted by creation date
            const waitlist = await WaitlistModel
                .find({})
                .sort({dateAdded: 1});

            // Return 'OK' with users in waitlist if nothing goes wrong
            response.status(200).send(waitlist);
            console.log("GET:", waitlist);

        } catch (error) {
            response.status(500).send("Something went wrong processing the request");
            console.error("getWaitlistError:", error);
        }
    });

    app.post("/waitlist", async (request, response) => {
        try {
            const bodyData = request.body;

            // Check if user is already in database
            const exists = await WaitlistModel
                .findOne({username: bodyData.username})
                .collation({locale: "en", strength: 2});

            if (exists) {
                response.status(400).send({error: "User is already in wait list"});
                return;
            }

            // Save user on database
            const waitlistUser = new TomeModel(bodyData);
            await waitlistUser.save();

            response.status(201).send({waitlistUser});
        } catch (error) {
            response.status(500).send({error: "Something went wrong processing your request."});
            console.error("postWaitlistError:", error);
        }
    });

    app.delete("/waitlist/:username", async (request, response) => {
        try {
            // Get username from route
            const username = request.params.username;

            // Find entity by name and delete
            const result = WaitlistModel
                .findOneAndDelete({username: username})
                .collation({locale: "en", strength: 2});

            // If no entity was found, return 'Not Found'
            if (!result) {
                response.status(404).send({error: "User could not be found in wait list."});
                return;
            }

            // Else return 'No Content'
            response.status(204).send();
        } catch (error) {
            response.status(500).send({error: "Something went wrong processing your request."});
            console.error("deleteTomeError:", error);
        }
    });
}

export default mapWaitlistEndpoints;