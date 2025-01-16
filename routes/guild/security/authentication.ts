import { Router } from "express";
import { GuildRequest } from "../../../communication/requests/guildRequest.js";
import generateJwtToken from "./jwtTokenGenerator.js";
import { DefaultResponse } from "../../../communication/responses/defaultResponse.js";
import { TokenResponseModel } from "../../../models/responseModels.js";
import verifyGuild from "../../../middleware/verifyGuild.middleware.js";

/**
 * Maps all authentication-related endpoints.
 */
const authenticationRouter = Router({ mergeParams: true });

authenticationRouter.post(
    "/get-token/:wynnGuildId",
    verifyGuild,
    async (request: GuildRequest<{}, {}, { validationKey: string }>, response: DefaultResponse<TokenResponseModel>) => {
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

// authenticationRouter.post(
//     "/refresh-token",
//     async (request: Request<{}, {}, { refreshToken: string }>, response: Response) => {
//         // Gets a token if correct validationKey is provided
//         const refreshToken = request.body.refreshToken;
//         const result = refreshJwtToken(refreshToken);

//         if (result.status) {
//             response.status(200).json(result);
//         } else {
//             response.status(400).json(result);
//         }
//     }
// );

export default authenticationRouter;
