import { Request, Response, Router } from "express";
import { UsernametoUUID } from "../services/mojangApiClient.js";
import UserModel from "../models/userModel.js";
import validateJwtToken from "../security/jwtTokenValidator.js";
import { decrementAspects } from "../services/updateAspects.js";
import verifyGuild from "../middleware/verifyGuild.middleware.js";

/**
 * Maps all aspect-related endpoints.
 */
const aspectRouter = Router();

aspectRouter.get("/", async (request: Request, response: Response) => {
    try {
        // Get 10 users with the highest aspect count
        const aspects = await UserModel.find({ aspects: { $gt: 0 } }).sort({ aspects: -1 });

        response.send(aspects);
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing the request." });
        console.error("getAspectsError:", error);
    }
});

aspectRouter.get("/:username", async (request: Request<{ username: string }>, response: Response) => {
    try {
        // Get aspect data for specified user
        const aspect = await UserModel.findOne({ uuid: await UsernametoUUID(request.params.username) }).collation({
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

aspectRouter.post(
    "/",
    validateJwtToken,
    verifyGuild("b250f587-ab5e-48cd-bf90-71e65d6dc9e7"),
    async (request: Request<{}, {}, { username: string }>, response: Response) => {
        try {
            decrementAspects(request.body.username);
        } catch (error) {
            response.status(500).send({ error: "Something went wrong processing the request." });
            console.error("postAspectError:", error);
        }
    }
);

export default aspectRouter;
