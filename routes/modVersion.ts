import { Request, Response, Router } from "express";
import getLatestVersion from "../utils/getLatestVersion.js";

/**
 * Maps all mod version related endpoints.
 */
const modVersionRouter = Router();

/**
 * Returns a modrinth download link, or null if the mod version is up to date
 */
modVersionRouter.get("/update", async (request: Request, response: Response) => {
    // Gets a token if correct validationKey is provided
    const latestVersion = await getLatestVersion();
    if (!latestVersion) {
        response.status(500).send({ error: "something went wrong" });
        console.log("get latest version error");
        return;
    }
    response.send(latestVersion);
});

export default modVersionRouter;
