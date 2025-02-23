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

@JsonController('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/blocked/:uuid')
    async getBlockedList(@Param('uuid') uuid: string) {
        uuid = uuid.replaceAll('-', '');

        return await this.userService.getBlockedList({ uuid });
    }

    @Post('/blocked/:uuid')
    @HttpCode(201)
    async addUserToBlockedList(
        @Param('uuid') uuid: string,
        @Body() body: { toBlock: string },
    ) {
        uuid = uuid.replaceAll('-', '');

        return this.userService.addToBlockedList({ uuid }, body.toBlock);
    }

    @Delete('/blocked/:uuid/:toRemove')
    @HttpCode(204)
    async removeUserFromBlockedList(
        @Param('uuid') uuid: string,
        @Param('toRemove') toRemove: string,
    ) {
        uuid = uuid.replaceAll('-', '');

        await this.userService.removeFromBlockedList({ uuid }, toRemove);
    }
}
