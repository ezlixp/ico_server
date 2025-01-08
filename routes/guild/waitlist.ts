import { Router } from "express";
import { guildDatabases } from "../../models/guildDatabaseModel.js";
import validateJwtToken from "../../middleware/jwtTokenValidator.middleware.js";
import { GuildRequest } from "../../communication/requests/guildRequest.js";
import verifyGuild from "../../middleware/verifyGuild.middleware.js";
import { DefaultResponse } from "../../communication/responses/defaultResponse.js";
import { IWaitlist } from "../../models/schemas/waitlistSchema.js";

/**
 * Maps all tome-related endpoints
 */
const waitlistRouter = Router();

waitlistRouter.get(
    "/:wynnGuildId",
    verifyGuild,
    async (request: GuildRequest, response: DefaultResponse<IWaitlist[]>) => {
        try {
            // Get users sorted by creation date
            const waitlist = await guildDatabases[request.params.wynnGuildId].WaitlistModel.find().sort({
                dateAdded: 1,
            });

            // Return 'OK' with users in waitlist if nothing goes wrong
            response.status(200).send(waitlist);
        } catch (error) {
            response.status(500).send({ error: "Something went wrong processing the request" });
            console.error("getWaitlistError:", error);
        }
    }
);

waitlistRouter.post(
    "/:wynnGuildId",
    verifyGuild,
    validateJwtToken,
    async (request: GuildRequest, response: DefaultResponse<IWaitlist>) => {
        try {
            const username = request.body.username;

            // Check if user is already in database
            const exists = await guildDatabases[request.params.wynnGuildId].WaitlistModel.findOne({
                username: username,
            }).collation({
                locale: "en",
                strength: 2,
            });

            if (exists) {
                response.status(400).send({ error: "User is already in wait list" });
                return;
            }

            // Save user on database
            const waitlistUser = new guildDatabases[request.params.wynnGuildId].WaitlistModel({ username: username });
            await waitlistUser.save();

            response.status(201).send(waitlistUser);
        } catch (error) {
            response.status(500).send({
                error: "Something went wrong processing your request.",
            });
            console.error("postWaitlistError:", error);
        }
    }
);

waitlistRouter.delete(
    "/:wynnGuildId/:username",
    verifyGuild,
    validateJwtToken,
    async (request: GuildRequest<{ username: string }>, response: DefaultResponse) => {
        try {
            // Get username from route
            const username = request.params.username;

            // Find entity by name and delete
            const result = await guildDatabases[request.params.wynnGuildId].WaitlistModel.findOneAndDelete({
                username: username,
            }).collation({
                locale: "en",
                strength: 2,
            });

            // If no entity was found, return 'Not Found'
            if (!result) {
                response.status(404).send({
                    error: "User could not be found in wait list.",
                });
                return;
            }

            // Else return 'No Content'
            response.status(204).send();
        } catch (error) {
            response.status(500).send({
                error: "Something went wrong processing your request.",
            });
            console.error("deleteWaitlistError:", error);
        }
    }
);

export default waitlistRouter;
