import { Request, Router } from "express";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware.js";
import ValidationModel, { IValidation } from "../models/validationModel.js";
import { GuildDatabaseCreator } from "../services/guild/guildDatabaseCreator.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";

/**
 * Maps all mod version related endpoints.
 */
const adminRouter = Router();

adminRouter.post(
    "/new-guild",
    validateAdminJwtToken,
    async (
        request: Request<{}, {}, { wynnGuildId: string; wynnGuildName: string; validationKey: string }>,
        response: DefaultResponse<IValidation>
    ) => {
        try {
            if (
                await ValidationModel.findOne({
                    $or: [{ wynnGuildId: request.body.wynnGuildId }, { wynnGuildName: request.body.wynnGuildName }],
                }).exec()
            ) {
                response.status(400).send({ error: "Guild already exists." });
                return;
            }
            const newGuild = new ValidationModel({
                wynnGuildId: request.body.wynnGuildId,
                wynnGuildName: request.body.wynnGuildName,
                validationKey: request.body.validationKey,
            });
            await newGuild.save();
            const databaseCreator = new GuildDatabaseCreator();
            databaseCreator.newDatabase(request.body.wynnGuildName, request.body.wynnGuildId);
            response.send(newGuild);
        } catch (error) {
            response.status(500).send({ error: "Something went wrong processing the request." });
            console.error("new guild error:", error);
        }
    }
);

export default adminRouter;
