import 'reflect-metadata';
import { UserService } from './user.service.js';
import {
    Body,
    Delete,
    Get,
    HttpCode,
    JsonController,
    Param,
    Post,
} from 'routing-controllers';
import { BASE_API_URI } from '../../config.js';
import { injectable } from 'tsyringe';
import { IUser } from './user.model.js';

@injectable()
@JsonController(BASE_API_URI + '/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/blocked/:uuid')
    async getBlockedList(@Param('uuid') uuid: string): Promise<string[]> {
        uuid = uuid.replaceAll('-', '');

        return await this.userService.getBlockedList({ uuid });
    }

    @Post('/blocked/:uuid')
    @HttpCode(201)
    async addUserToBlockedList(
        @Param('uuid') uuid: string,
        @Body() body: { toBlock: string },
    ): Promise<IUser> {
        uuid = uuid.replaceAll('-', '');

        return this.userService.addToBlockedList({ uuid }, body.toBlock);
    }

    @Delete('/blocked/:uuid/:toRemove')
    @HttpCode(204)
    async removeUserFromBlockedList(
        @Param('uuid') uuid: string,
        @Param('toRemove') toRemove: string,
    ): Promise<void> {
        uuid = uuid.replaceAll('-', '');

        await this.userService.removeFromBlockedList({ uuid }, toRemove);
    }
}
