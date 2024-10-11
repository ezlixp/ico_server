import { Request, Response, Router } from "express";
import UserModel from "../models/userModel.js";

/**
 * Maps all aspect-related endpoints.
 */
const aspectRouter = Router();

aspectRouter.get("/aspects", async (request: Request, response: Response) => {
    try {
        // Get 10 users with the highest aspect count
        const aspects = await UserModel.find({}).sort({ aspects: -1 }).limit(10);

        response.send(aspects);
    } catch (error) {
        response.status(500);
        response.send({ error: "Something went wrong processing the request." });
        console.error("getAspectsError:", error);
    }
});

aspectRouter.get("/aspects/:username", async (request: Request<{ username: string }>, response: Response) => {
    try {
        // Get aspect data for specified user
        const aspect = await UserModel.findOne({ username: request.params.username }).collation({
            locale: "en",
            strength: 2,
        });

        if (!aspect) {
            response.status(404).send({ error: "Specified user could not be found in aspect list." });
            return;
        }
        response.send(aspect);
        console.log("GET specific:", aspect);
    } catch (error) {
        response.status(500);
        response.send({ error: "Something went wrong processing the request." });
        console.error("getSpecificAspectsError:", error);
    }
});

export default aspectRouter;
