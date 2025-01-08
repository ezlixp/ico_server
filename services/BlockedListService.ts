import {UserRepository} from "../repositories/userRepository.js";
import {FilterOptions} from "../repositories/base/baseRepository.js";
import {IUser} from "../models/userModel.js";
import {NotFoundError} from "../errors/implementations/notFoundError.js";
import {UserErrors} from "../errors/messages/userErrors.js";
import {ValidationError} from "../errors/implementations/validationError.js";

export class BlockedListService {
    private readonly repository: UserRepository;
    private readonly validator: BlockedListServiceValidator;

    private constructor() {
        this.repository = new UserRepository();
        this.validator = new BlockedListServiceValidator();
    }

    static create(): BlockedListService {
        return new BlockedListService();
    }

    async getBlockedList(userId: FilterOptions): Promise<string[]> {
        const user = await this.getUser(userId);

        return user.blocked;
    }

    async addToBlockedList(userId: FilterOptions, toBlock: string): Promise<IUser> {
        const user = await this.getUser(userId);
        this.validator.validateAddToBlockedList(user, toBlock);

        user.blocked.push(toBlock);

        return await this.repository.update({uuid: user.uuid}, user);
    }

    async removeFromBlockedList(userId: FilterOptions, toRemove: string): Promise<void> {
        const user = await this.getUser(userId);
        this.validator.validateRemoveFromBlockedList(user, toRemove);

        user.blocked = user.blocked.filter((blockedUser) => blockedUser !== toRemove);

        await this.repository.update({uuid: user.uuid}, user);
    }

    private async getUser(options: FilterOptions): Promise<IUser> {
        let user = await this.repository.findOne(options);
        this.validator.validateGet(user);

        return user;
    }
}

class BlockedListServiceValidator {
    validateGet(user: IUser | null): asserts user is IUser {
        if (!user) {
            throw new NotFoundError(UserErrors.NOT_FOUND);
        }
    }

    validateAddToBlockedList(user: IUser, toBlock: string) {
        if (user.blocked.length >= 60) {
            throw new ValidationError(UserErrors.FULL_BLOCKED_LIST);
        }
        if (user.blocked.includes(toBlock)) {
            throw new ValidationError(UserErrors.ALREADY_IN_BLOCKED_LIST);
        }
    }

    validateRemoveFromBlockedList(user: IUser, toRemove: string) {
        if (!user.blocked.includes(toRemove)) {
            throw new ValidationError(UserErrors.NOT_IN_BLOCKED_LIST);
        }
    }
}
