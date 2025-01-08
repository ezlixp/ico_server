import validateJwtToken from "../../middleware/jwtTokenValidator.middleware.js";
import { Router } from "express";
import verifyInGuild from "../../middleware/verifyInGuild.middleware.js";
import { GuildRequest } from "../../types/requestTypes.js";
import { DefaultResponse } from "../../types/responseTypes.js";
import { ITome } from "../../models/schemas/tomeSchema.js";
import { TomeService } from "../../services/guild/tomeService.js";

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
    }
);

export default tomeRouter;
