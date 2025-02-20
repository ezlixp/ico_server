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
        this.registerRoutes();
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
    ) {
        const toBlock = request.body.toBlock;
        const uuid = request.params.uuid.replaceAll('-', '');
        const updatedUser = await this.userService.addToBlockedList(
            { uuid },
            toBlock,
        );

        response.status(200).send(updatedUser);
    }

    async removeUserFromBlockedList(
        request: Request<{ uuid: string; toRemove: string }>,
        response: DefaultResponse,
    ) {
        const uuid = request.params.uuid.replaceAll('-', '');
        const toRemove = request.params.toRemove;

        await this.userService.removeFromBlockedList({ uuid }, toRemove);

        response.status(204).send();
    }

    getRouter(): Router {
        return this.router;
    }

    private registerRoutes() {
        this.router.get('/blocked/:uuid', this.getBlockedList.bind(this));
        this.router.post(
            '/blocked/:uuid',
            this.addUserToBlockedList.bind(this),
        );
        this.router.delete(
            '/blocked/:uuid/:toRemove',
            this.removeUserFromBlockedList.bind(this),
        );
    }
}
