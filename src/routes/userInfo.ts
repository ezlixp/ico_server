import { Request, Router } from "express";
import validateJwtToken from "../middleware/jwtTokenValidator.middleware.js";
import { IUser } from "../models/entities/userModel.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware.js";
import verifyInGuild from "../middleware/verifyInGuild.middleware.js";
import { usernameToUuid } from "../communication/httpClients/mojangApiClient.js";
import { GuildRequest } from "../communication/requests/guildRequest.js";
import { HydratedDocument } from "mongoose";
import Services from "../services/services.js";

/**Maps all endpoints related to user information. endpoint: .../user/*/
const userInfoRouter = Router();
userInfoRouter.use(validateJwtToken);

// TODO: validate token for uuid being updated
userInfoRouter.get(
    "/blocked/:mcUuid",
    async (request: Request<{ mcUuid: string }>, response: DefaultResponse<string[]>) => {
        const mcUuid = request.params.mcUuid.replaceAll("-", "");
        const blockedList = await Services.user.getBlockedList({ mcUuid: mcUuid });

        response.status(200).send(blockedList);
    }
);

userInfoRouter.post(
    "/blocked/:mcUuid",
    async (request: Request<{ mcUuid: string }, {}, { toBlock: string }>, response: DefaultResponse<IUser>) => {
        const toBlock = request.body.toBlock;
        const uuid = request.params.mcUuid.replaceAll("-", "");
        const updatedUser = await Services.user.addToBlockedList({ mcUuid: uuid }, toBlock);

        response.status(200).send(updatedUser);
    }
);

userInfoRouter.delete(
    "/blocked/:mcUuid/:toRemove",
    async (request: Request<{ mcUuid: string; toRemove: string }>, response: DefaultResponse) => {
        const uuid = request.params.mcUuid.replaceAll("-", "");
        const toRemove = request.params.toRemove;

        await Services.user.removeFromBlockedList({ mcUuid: uuid }, toRemove);

        response.status(204).send();
    }
);

userInfoRouter.post(
    "/link/:wynnGuildId",
    verifyInGuild,
    validateAdminJwtToken,
    async (
        request: GuildRequest<{}, {}, { mcUsername: string; discordUuid: string }>,
        response: DefaultResponse<HydratedDocument<IUser>>
    ) => {
        response.status(200).send(
            await Services.user.linkUser({
                discordUuid: request.body.discordUuid,
                mcUuid: request.body.mcUsername ? "" : await usernameToUuid(request.body.mcUsername),
            })
        );
    }
);

userInfoRouter.post(
    "/ban/:discordUuid",
    validateAdminJwtToken,
    async (request: Request<{ discordUuid: string }, {}, { banned: boolean }>, response: DefaultResponse) => {
        response.send(
            await Services.user.updateUser({ discordUuid: request.params.discordUuid }, { banned: request.body.banned })
        );
    }
);

// userInfoRouter.post(
//     "/mute/:discordUuid",
//     validateAdminJwtToken,
//     async (request: Request<{ discordUuid: string }, {}, { muted: boolean }>, response: DefaultResponse) => {
//         response.send(
//             await Services.user.updateUser({ discordUuid: request.params.discordUuid }, { muted: request.body.muted })
//         );
//     }
// );

export default userInfoRouter;
