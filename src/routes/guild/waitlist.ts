import { Router } from "express";
import validateJwtToken from "../../middleware/jwtTokenValidator.middleware";
import { GuildRequest } from "../../communication/requests/guildRequest";
import { DefaultResponse } from "../../communication/responses/defaultResponse";
import { IWaitlist } from "../../models/schemas/waitlistSchema";
import { WaitlistService } from "../../services/guild/waitlistService";

/**
 * Maps all tome-related endpoints
 */
const waitlistRouter = Router();
const waitlistService = WaitlistService.create();

waitlistRouter.get("/:wynnGuildId", async (request: GuildRequest, response: DefaultResponse<IWaitlist[]>) => {
    response.send(await waitlistService.getWaitlist(request.params.wynnGuildId));
});

waitlistRouter.post(
    "/:wynnGuildId",
    validateJwtToken,
    async (request: GuildRequest<{}, {}, { mcUsername: string }>, response: DefaultResponse<IWaitlist>) => {
        response.send(await waitlistService.addToWaitlist(request.body.mcUsername, request.params.wynnGuildId));
    }
);

waitlistRouter.delete(
    "/:wynnGuildId/:mcUsername",
    validateJwtToken,
    async (request: GuildRequest<{ mcUsername: string }>, response: DefaultResponse) => {
        await waitlistService.removeFromWaitlist(request.params.mcUsername, request.params.wynnGuildId);
        response.send();
    }
);

export default waitlistRouter;
