import WaitlistModel from "../models/waitlistModel.js";
import validateJwtToken from "../security/jwtTokenValidator.js";

/**
 * Maps all tome-related endpoints
 * @param {Express} app
 */
function mapWaitlistEndpoints(app) {
    app.get("/waitlist", async (request, response) => {
        try {
            // Get users sorted by creation date
            const waitlist = await WaitlistModel.find({}).sort({dateAdded: 1});

            // Return 'OK' with users in waitlist if nothing goes wrong
            response.status(200).send(waitlist);
            console.log("GET:", waitlist);
        } catch (error) {
            response.status(500).send("Something went wrong processing the request");
            console.error("getWaitlistError:", error);
        }
    });

    app.post("/waitlist", validateJwtToken, async (request, response) => {
        try {
            const username = request.body.username;

            // Check if user is already in database
            const exists = await WaitlistModel.findOne({username: username}).collation({
                locale: "en",
                strength: 2,
            });

            if (exists) {
                response.status(400).send({error: "User is already in wait list"});
                return;
            }

            // Save user on database
            const waitlistUser = new WaitlistModel({username: username});
            await waitlistUser.save();

            response.status(201).send({waitlistUser});
        } catch (error) {
            response.status(500).send({error: "Something went wrong processing your request."});
            console.error("postWaitlistError:", error);
        }
    });

    app.delete("/waitlist/:username", validateJwtToken, async (request, response) => {
        try {
            // Get username from route
            const username = request.params.username;

            // Find entity by name and delete
            const result = await WaitlistModel.findOneAndDelete({username: username}).collation({
                locale: "en",
                strength: 2,
            });
            console.log(result);

            // If no entity was found, return 'Not Found'
            if (!result) {
                response.status(404).send({error: "User could not be found in wait list."});
                return;
            }

            // Else return 'No Content'
            response.status(204).send();
        } catch (error) {
            response.status(500).send({error: "Something went wrong processing your request."});
            console.error("deleteWaitlistError:", error);
        }
    });
}

export default mapWaitlistEndpoints;
