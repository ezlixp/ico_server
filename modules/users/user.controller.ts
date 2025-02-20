import { injectable, singleton } from 'tsyringe';
import { UserService } from './user.service.js';
import { Request } from 'express';
import { DefaultResponse } from '../../communication/responses/defaultResponse.js';
import { IUser } from './user.model.js';
import {
    HttpDelete,
    HttpGet,
    HttpPost,
} from '../../decorators/http.methods.js';

@injectable()
@singleton()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @HttpGet('/blocked/:uuid')
    async getBlockedList(
        request: Request<{ uuid: string }>,
        response: DefaultResponse<string[]>,
    ): Promise<void> {
        const uuid = request.params.uuid.replaceAll('-', '');
        const blockedList = await this.userService.getBlockedList({ uuid });

        response.status(200).send(blockedList);
    }

    @HttpPost('/blocked/:uuid')
    async addUserToBlockedList(
        request: Request<{ uuid: string }, unknown, { toBlock: string }>,
        response: DefaultResponse<IUser>,
    ) {
        const toBlock = request.body.toBlock;
        const uuid = request.params.uuid.replaceAll('-', '');
        const updatedUser = await this.userService.addToBlockedList(
            { uuid },
            toBlock,
        );

        response.status(200).send(updatedUser);
    }

    @HttpDelete('/blocked/:uuid/:toRemove')
    async removeUserFromBlockedList(
        request: Request<{ uuid: string; toRemove: string }>,
        response: DefaultResponse,
    ) {
        const uuid = request.params.uuid.replaceAll('-', '');
        const toRemove = request.params.toRemove;

        await this.userService.removeFromBlockedList({ uuid }, toRemove);

        response.status(204).send();
    }
}
