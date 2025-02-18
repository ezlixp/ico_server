import validateJwtToken from "../../middleware/jwtTokenValidator.middleware.js";
import { Router } from "express";
import verifyInGuild from "../../middleware/verifyInGuild.middleware.js";
import { ITome } from "../../models/schemas/tomeSchema.js";
import { TomeService } from "../../services/guild/tomeService.js";
import { GuildRequest } from "../../communication/requests/guildRequest.js";
import { DefaultResponse } from "../../communication/responses/defaultResponse.js";

/**
 * Maps all tome-related endpoints
 */
const tomeRouter = Router();
const tomeService = TomeService.create();

tomeRouter.get("/:wynnGuildId", async (request: GuildRequest, response: DefaultResponse<ITome[]>) => {
    response.send(await tomeService.getTomeList(request.params.wynnGuildId));
});

tomeRouter.post(
    "/:wynnGuildId",
    validateJwtToken,
    verifyInGuild,
    async (request: GuildRequest<{}, {}, { username: string }>, response: DefaultResponse<ITome>) => {
        response.send(await tomeService.addToTomeList({ username: request.body.username }, request.params.wynnGuildId));
    }
);

tomeRouter.get(
    "/:wynnGuildId/:username",
    async (
        request: GuildRequest<{ username: string }>,
        response: DefaultResponse<{ username: string; position: number }>
    ) => {
        response.send(
            await tomeService.getTomeListPosition({ username: request.params.username }, request.params.wynnGuildId)
        );
    }
);

tomeRouter.delete(
    "/:wynnGuildId/:username",
    validateJwtToken,
    async (request: GuildRequest<{ username: string }>, response: DefaultResponse) => {
        tomeService.deleteFromTomeList({ username: request.params.username }, request.params.wynnGuildId);
        response.status(204).send();
    }
);

export default tomeRouter;
