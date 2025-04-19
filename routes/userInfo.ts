import { Request, Router } from "express";
import validateJwtToken from "../middleware/jwtTokenValidator.middleware.js";
import { IUser } from "../models/entities/userModel.js";
import { UserInfoService } from "../services/userInfoService.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import validateAdminJwtToken from "../middleware/jwtAdminTokenValidator.middleware.js";
import verifyInGuild from "../middleware/verifyInGuild.middleware.js";
import { usernameToUuid } from "../communication/httpClients/mojangApiClient.js";
import { GuildRequest } from "../communication/requests/guildRequest.js";
import { HydratedDocument } from "mongoose";

/**Maps all endpoints related to user information. endpoint: .../user/*/
const userInfoRouter = Router();
userInfoRouter.use(validateJwtToken);

const userInfoService = UserInfoService.create();

// TODO: validate token for uuid being updated
userInfoRouter.get(
    "/blocked/:mcUuid",
    async (request: Request<{ mcUuid: string }>, response: DefaultResponse<string[]>) => {
        const uuid = request.params.mcUuid.replaceAll("-", "");
        const blockedList = await userInfoService.getBlockedList({ uuid });

        response.status(200).send(blockedList);
    }
);

userInfoRouter.post(
    "/blocked/:mcUuid",
    async (request: Request<{ mcUuid: string }, {}, { toBlock: string }>, response: DefaultResponse<IUser>) => {
        const toBlock = request.body.toBlock;
        const uuid = request.params.mcUuid.replaceAll("-", "");
        const updatedUser = await userInfoService.addToBlockedList({ uuid }, toBlock);

        response.status(200).send(updatedUser);
    }
);

userInfoRouter.delete(
    "/blocked/:mcUuid/:toRemove",
    async (request: Request<{ mcUuid: string; toRemove: string }>, response: DefaultResponse) => {
        const uuid = request.params.mcUuid.replaceAll("-", "");
        const toRemove = request.params.toRemove;

        await userInfoService.removeFromBlockedList({ uuid }, toRemove);

        response.status(204).send();
    }
);

userInfoRouter.post(
    "/link/:wynnGuildId",
    verifyInGuild,
    validateAdminJwtToken,
    async (
        request: GuildRequest<{}, {}, { username: string; discordUuid: string }>,
        response: DefaultResponse<HydratedDocument<IUser>>
    ) => {
        response.status(200).send(
            await userInfoService.linkUser({
                discordUuid: request.body.discordUuid,
                mcUuid: await usernameToUuid(request.body.username),
            })
        );
    }
);

userInfoRouter.delete(
    "/link/:discordUuid",
    validateAdminJwtToken,
    async (request: Request<{ discordUuid: string }>, response: DefaultResponse) => {
        response.send(await userInfoService.updateUser({ discordUuid: request.params.discordUuid }, { mcUuid: "" }));
    }
);

export default userInfoRouter;
