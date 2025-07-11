import { Request, Router } from "express";
import { getLatestVersion, IModVersionResponse } from "../utils/versionUtils";
import { DefaultResponse } from "../communication/responses/defaultResponse";
import { DatabaseError } from "../errors/implementations/databaseError";

/**
 * Maps all mod version related endpoints.
 */
const modVersionRouter = Router();

/**
 * Returns a modrinth download link, or null if the mod version is up to date
 */
modVersionRouter.get("/update", async (request: Request, response: DefaultResponse<IModVersionResponse>) => {
    // Gets a token if correct validationKey is provided
    const latestVersion = await getLatestVersion();
    if (!latestVersion) {
        throw new DatabaseError();
    }
    response.send(latestVersion);
});

export default modVersionRouter;
