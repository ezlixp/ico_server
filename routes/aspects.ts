import { Request, Response, Router } from "express";
import { usernameToUuid } from "../net/mojangApiClient.js";
import validateJwtToken from "../security/jwtTokenValidator.js";
import { decrementAspects } from "../utils/aspectUtils.js";
import { guildDatabases } from "../models/guildDatabaseModel.js";

/**
 * Maps all aspect-related endpoints.
 */
const aspectRouter = Router({ mergeParams: true });

aspectRouter.get("/", async (request: Request, response: Response) => {
    try {
        // Get 10 users with the highest aspect count
        const aspects = await guildDatabases[request.wynnGuildId!].GuildUserModel.find({ aspects: { $gt: 0 } }).sort({
            aspects: -1,
        });

        response.send(aspects);
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing the request." });
        console.error("getAspectsError:", error);
    }
});

aspectRouter.get("/:username", async (request: Request<{ username: string }>, response: Response) => {
    try {
        // Get aspect data for specified user
        const aspect = await guildDatabases[request.wynnGuildId!].GuildUserModel.findOne({
            uuid: await usernameToUuid(request.params.username),
        }).collation({
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
        response.status(500).send({ error: "Something went wrong processing the request." });
        console.error("getSpecificAspectsError:", error);
    }
});

aspectRouter.post("/", validateJwtToken, async (request: Request<{}, {}, { username: string }>, response: Response) => {
    try {
        decrementAspects(request.body.username, request.wynnGuildId!);
    } catch (error) {
        response.status(500).send({ error: "Something went wrong processing the request." });
        console.error("postAspectError:", error);
    }
});

export default aspectRouter;
