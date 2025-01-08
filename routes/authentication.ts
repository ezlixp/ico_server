import { Router } from "express";
import { GuildRequest } from "../types/requestTypes.js";
import generateJwtToken from "../security/jwtHandler.js";
import { DefaultResponse } from "../types/responseTypes.js";
import { TokenResponse } from "../communication/responses/tokenResponse.js";
import verifyInGuild from "../middleware/verifyInGuild.middleware.js";

/**
 * Maps all authentication-related endpoints.
 */
const authenticationRouter = Router({ mergeParams: true });

authenticationRouter.post(
    "/get-token/:wynnGuildId",
    verifyInGuild,
    async (request: GuildRequest<{}, {}, { validationKey: string }>, response: DefaultResponse<TokenResponse>) => {
        // Gets a token if correct validationKey is provided
        const validationKey = request.body.validationKey;
        const result = await generateJwtToken(validationKey, request.params.wynnGuildId);

        if (result.status) {
            response.status(200).send(result);
        } else {
            response.status(400).send(result);
        }
    }
);

export default authenticationRouter;
