import {UserRepository} from "../repositories/UserRepository.js";
import {FilterOptions} from "../repositories/base/BaseRepository.js";
import {IUser} from "../models/userModel.js";
import {NotFoundError} from "../errors/implementations/NotFoundError.js";
import {UserErrors} from "../errors/messages/UserErrors.js";
import {ValidationError} from "../errors/implementations/ValidationError.js";

export class BlockedListService {
    private readonly repository: UserRepository;
    private readonly validator: UserServiceValidator;

    private constructor() {
        this.repository = new UserRepository();
        this.validator = new UserServiceValidator();
    }

    static create(): BlockedListService {
        return new BlockedListService();
    }

    async getBlockedList(userId: FilterOptions): Promise<string[]> {
        const user = await this.getUser(userId);

        return user.blocked;
    }

    async AddToBlockedList(userId: FilterOptions, toBlock: string): Promise<IUser> {
        const user = await this.getUser(userId);
        this.validator.validateAddToBlockedList(user, toBlock);

        user.blocked.push(toBlock);

        return await this.repository.update({uuid: user.uuid}, user);
    }

    async removeFromBlockedList(userId: FilterOptions, toRemove: string): Promise<void> {
        const user = await this.getUser(userId);
        this.validator.validateRemoveFromBlockedList(user, toRemove);

        user.blocked = user.blocked.filter(blockedUser => blockedUser !== toRemove);

        await this.repository.update({uuid: user.uuid}, user);
    }

    private async getUser(options: FilterOptions): Promise<IUser> {
        let user = await this.repository.findOne(options);
        this.validator.validateGet(user);

        return user;
    }
}

class UserServiceValidator {
    validateGet(user: IUser | null): asserts user is IUser {
        if (!user) {
            throw new NotFoundError(UserErrors.NotFound);
        }
    }

    validateAddToBlockedList(user: IUser, toBlock: string) {
        if (user.blocked.length >= 60) {
            throw new ValidationError(UserErrors.FullBlockedList);
        }
        if (user.blocked.includes(toBlock)) {
            throw new ValidationError(UserErrors.AlreadyInBlockedList);
        }
    }

    validateRemoveFromBlockedList(user: IUser, toRemove: string) {
        if (!user.blocked.includes(toRemove)) {
            throw new ValidationError(UserErrors.NotInBlockedList);
        }
    }
}