import { Request, Router } from "express";
import validateJwtToken from "../middleware/jwtTokenValidator.middleware.js";
import { IUser } from "../models/entities/userModel.js";
import { BlockedListService } from "../services/blockedListService.js";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";

/**Maps all endpoints related to user information. */
const userInfoRouter = Router();
userInfoRouter.use(validateJwtToken);

const blockedListService = BlockedListService.create();

// TODO: validate token for uuid being updated
userInfoRouter.get(
    "/blocked/:uuid",
    async (request: Request<{ uuid: string }>, response: DefaultResponse<string[]>) => {
        const uuid = request.params.uuid.replaceAll("-", "");
        const blockedList = await blockedListService.getBlockedList({ uuid });

        response.status(200).send(blockedList);
    }
);

userInfoRouter.post(
    "/blocked/:uuid",
    async (request: Request<{ uuid: string }, {}, { toBlock: string }>, response: DefaultResponse<IUser>) => {
        const toBlock = request.body.toBlock;
        const uuid = request.params.uuid.replaceAll("-", "");
        const updatedUser = await blockedListService.addToBlockedList({ uuid }, toBlock);

        response.status(200).send(updatedUser);
    }
);

userInfoRouter.delete(
    "/blocked/:uuid/:toRemove",
    async (request: Request<{ uuid: string; toRemove: string }>, response: DefaultResponse) => {
        const uuid = request.params.uuid.replaceAll("-", "");
        const toRemove = request.params.toRemove;

        await blockedListService.removeFromBlockedList({ uuid }, toRemove);

        response.status(204).send();
    }
);

export default userInfoRouter;
