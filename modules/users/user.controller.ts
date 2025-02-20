import { injectable, singleton } from 'tsyringe';
import { UserService } from './user.service.js';
import { Request, Router } from 'express';
import { DefaultResponse } from '../../communication/responses/defaultResponse.js';
import { IUser } from './user.model.js';

@injectable()
@singleton()
export class UserController {
    private readonly router: Router;

    constructor(private readonly userService: UserService) {
        this.router = Router();
    }

    async getBlockedList(
        request: Request<{ uuid: string }>,
        response: DefaultResponse<string[]>,
    ): Promise<void> {
        const uuid = request.params.uuid.replaceAll('-', '');
        const blockedList = await this.userService.getBlockedList({ uuid });

        response.status(200).send(blockedList);
    }

    async addUserToBlockedList(
        request: Request<{ uuid: string }, {}, { toBlock: string }>,
        response: DefaultResponse<IUser>,
    ) {}

    getRouter(): Router {
        return this.router;
    }
}
