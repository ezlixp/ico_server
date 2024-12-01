import validateJwtToken from "../security/jwtTokenValidator.js";
import TomeModel from "../models/tomeModel.js";
import { Request, Response, Router } from "express";
import verifyGuild from "../middleware/verifyGuild.middleware.js";

/**
 * Maps all tome-related endpoints
 */
const tomeRouter = Router();

tomeRouter.get("/", async (request: Request, response: Response) => {
    try {
        // Get users ordered by time added
        const tomeList = await TomeModel.find({}).sort({ dateAdded: 1 });

        // Return 'OK' if nothing goes wrong
        response.status(200).send(tomeList);
    } catch (error) {
        response.status(500);
        response.send({ error: "Something went wrong processing the request." });
        console.error("getTomesError:", error);
    }
});

tomeRouter.get("/:username", async (request: Request<{ username: string }>, response: Response) => {
    try {
        // Search for specific user
        const result = await TomeModel.findOne({ username: request.params.username }).collation({
            strength: 2,
            locale: "en",
        });

        if (!result) {
            response.status(404).send({
                error: "Specified user could not be found in tome list.",
            });
            return;
        }

        const position =
            (await TomeModel.find({ dateAdded: { $lt: result.dateAdded.getTime() } }).countDocuments()) + 1;

        // Return 'OK' if nothing goes wrong
        response.status(200).send({ username: result.username, position: position });
        console.log("GET:", result.username, "at position", position);
    } catch (error) {
        response.status(500);
        response.send({ error: "Something went wrong processing the request." });
        console.error("getTomesSpecificError:", error);
    }
});

tomeRouter.post(
    "/",
    validateJwtToken,
    verifyGuild("b250f587-ab5e-48cd-bf90-71e65d6dc9e7"),
    async (request: Request<{}, {}, { username: string }>, response: Response) => {
        try {
            // Save tome model on database
            const tomeData = request.body;

            const exists = await TomeModel.findOne({
                username: tomeData.username,
            }).collation({
                locale: "en",
                strength: 2,
            });

            // If user exists, return 'Bad Request'
            if (exists) {
                response.status(400).send({ error: "User already in tome list." });
                return;
            }

            // Create and save user in the database
            const tome = new TomeModel(tomeData);
            await tome.save();

            // Send 'Created' if saved successfully
            response.status(201).send(tome);
            console.log(tome, "added to tome list");
        } catch (error) {
            response.status(500).send({
                error: "Something went wrong processing your request.",
            });
            console.error("postTomeError:", error);
        }
    }
);

// TODO: implement search by uuid
tomeRouter.delete(
    "/:username",
    validateJwtToken,
    async (request: Request<{ username: string }>, response: Response) => {
        try {
            // Get username from route
            const username = request.params.username;

            // Find entity by name and delete
            const result = await TomeModel.findOneAndDelete({
                username: username,
            }).collation({
                locale: "en",
                strength: 2,
            });

            // If no entity was found, return 'Not Found'
            if (!result) {
                response.status(404).send({
                    error: "User could not be found in tome list.",
                });
                return;
            }

            // Else return 'No Content'
            response.status(204).send();
        } catch (error) {
            response.status(500).send({
                error: "Something went wrong processing your request.",
            });
            console.error("deleteTomeError:", error);
        }
    }
);

export default tomeRouter;
