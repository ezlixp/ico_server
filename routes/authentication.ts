import { Router } from "express";
import { TokenResponse } from "../communication/responses/tokenResponse.js";
import verifyInGuild from "../middleware/verifyInGuild.middleware.js";
import { JwtTokenHandler } from "../security/jwtHandler.js";
import { GuildRequest } from "../communication/requests/guildRequest.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";

/**
 * Maps all authentication-related endpoints.
 */
const authenticationRouter = Router({ mergeParams: true });
const tokenHandler = JwtTokenHandler.create();

authenticationRouter.post(
    "/get-token/:wynnGuildId",
    verifyInGuild,
    async (
        request: GuildRequest<{}, {}, { validationKey: string; username: string }>,
        response: DefaultResponse<TokenResponse>
    ) => {
        const validationKey = request.body.validationKey;
        const result = await tokenHandler.generateToken(validationKey, request.params.wynnGuildId);

        response.status(200).send(result);
    }
);

export default authenticationRouter;
