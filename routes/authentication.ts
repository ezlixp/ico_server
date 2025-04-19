import { Request, Router } from "express";
import { TokenResponse } from "../communication/responses/tokenResponse.js";
import { JwtTokenHandler } from "../security/jwtHandler.js";
import { GuildRequest } from "../communication/requests/guildRequest.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import { TokenError } from "../errors/implementations/tokenError.js";
import { getToken, getUser } from "../communication/httpClients/discordApiClient.js";
import { UserInfoService } from "../services/userInfoService.js";
import { ValidationError } from "../errors/implementations/validationError.js";
import { usernameToUuid } from "../communication/httpClients/mojangApiClient.js";
import { getPlayersGuildAsync } from "../communication/httpClients/wynncraftApiClient.js";

/**
 * Maps all authentication-related endpoints.
 */
const authenticationRouter = Router({ mergeParams: true });
const tokenHandler = JwtTokenHandler.create();
const userInfoService = UserInfoService.create();

authenticationRouter.get(
    "/get-token",
    async (
        request: GuildRequest<{ mcUsername: string }, {}, {}, { code?: string; state?: string }>,
        response: DefaultResponse<TokenResponse>
    ) => {}
);

authenticationRouter.post(
    "/get-token",
    async (request: Request<{}, {}, { code: string; mcUsername?: string }>, response: DefaultResponse) => {
        const code = request.body.code;
        if (!code) throw new ValidationError("No code provided.");

        if (code === process.env.JWT_VALIDATION_KEY) {
            return response.send(tokenHandler.generateAdminToken());
        }

        const mcUsername = request.body.mcUsername;
        if (!mcUsername) throw new ValidationError("No minecraft account provided");

        const discordToken = await getToken(code);
        if (!discordToken) throw new ValidationError("error validating discord account");

        // Checks database to see if mc username is properly linked with logged in discord account
        const discordUser = await getUser(discordToken.access_token);

        if (!discordUser) throw new ValidationError("could not validate discord account");

        const user = await userInfoService.getUser({ discordUuid: discordUser.id });
        if (user.mcUuid === (await usernameToUuid(mcUsername))) {
            user.verified = true;
            user.save();
            return response.send(
                await tokenHandler.generateToken(discordUser.id, await getPlayersGuildAsync(mcUsername))
            );
        }

        // Creates a token that allows access in given username's current guild
        throw new TokenError();
    }
);

export default authenticationRouter;
