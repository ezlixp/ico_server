import 'reflect-metadata';
import { UserRepository } from './user.repository.js';
import { IUser } from './user.model.js';
import { FilterQuery } from 'mongoose';
import { injectable } from 'tsyringe';
import { UserValidator } from './user.validator.js';

@injectable()
export class UserService {
    constructor(
        private readonly repository: UserRepository,
        private readonly validator: UserValidator,
    ) {}

    async getBlockedList(userId: FilterQuery<IUser>): Promise<string[]> {
        const user = await this.getUser(userId);

        return user.blocked;
    }

    async addToBlockedList(
        userId: FilterQuery<IUser>,
        toBlock: string,
    ): Promise<IUser> {
        const user = await this.getUser(userId);
        this.validator.validateAddToBlockedList(user, toBlock);

        user.blocked.push(toBlock);

        return await this.repository.update({ uuid: user.uuid }, user);
    }

    async removeFromBlockedList(
        userId: FilterQuery<IUser>,
        toRemove: string,
    ): Promise<void> {
        const user = await this.getUser(userId);
        this.validator.validateRemoveFromBlockedList(user, toRemove);

        user.blocked = user.blocked.filter(
            (blockedUser) => blockedUser !== toRemove,
        );

        await this.repository.update({ uuid: user.uuid }, user);
    }

    private async getUser(options: FilterQuery<IUser>): Promise<IUser> {
        const user = await this.repository.findOne(options);
        this.validator.validateGet(user);

        return user;
    }
}
