import validateJwtToken from "../security/jwtTokenValidator.js";
import TomeModel from "../models/tomeModel.js";

/**
 * Maps all tome-related endpoints
 * @param {Express} app
 */
function mapTomeEndpoints(app) {
    app.get("/tomes", async (request, response) => {
        try {
            // Get 10 users ordered by time added
            const tomeList = await TomeModel
                .find({})
                .sort({dateAdded: -1});

            // Return 'OK' if nothing goes wrong
            response.status(200).send(tomeList);
            console.log("GET:", tomeList);

        } catch (error) {
            response.status(500);
            response.send("Something went wrong processing the request.");
            console.error("getTomesError:", error);
        }
    });

    app.post("/tomes", validateJwtToken, async (request, response) => {
        try {
            // Save tome model on database
            const tomeData = request.body;

            const exists = TomeModel
                .findOne({username: tomeData.username})
                .collation({locale: "en", strength: 2});

            // If user exists, return 'Bad Request'
            if (exists) response.status(400).send({error: "User already in tome list."});

            // Create and save user in the database
            const tome = new TomeModel(tomeData);
            await tome.save();

            // Send 'Created' if saved successfully
            response.status(201).send(tome);
            console.log(tome, "added to tome list");
        } catch (error) {
            response.status(500).send({error: "Something went wrong processing your request."});
            console.error("postTomeError:", error);
        }
    });

    app.delete("/tomes/:username", validateJwtToken, async (request, response) => {
        try {        // Get username from route
            const username = request.params.username;

            // Find entity by name and delete
            const result = await TomeModel
                .findOneAndDelete({username: username})
                .collation({locale: "en", strength: 2});

            // If no entity was found, return 'Not Found'
            if (result) response.status(404);

            // Else return 'No Content'
            response.status(204);
        } catch (error) {
            response.status(500).send({error: "Something went wrong processing your request."});
            console.error("deleteTomeError:", error);
        }
    });
}

export default mapTomeEndpoints;