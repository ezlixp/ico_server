import { UserRepository } from "../repositories/userRepository.js";
import { IUser } from "../models/entities/userModel.js";
import { NotFoundError } from "../errors/implementations/notFoundError.js";
import { UserErrors } from "../errors/messages/userErrors.js";
import { ValidationError } from "../errors/implementations/validationError.js";
import { FilterQuery, HydratedDocument } from "mongoose";

export class UserInfoService {
    private readonly repository: UserRepository;
    private readonly validator: BlockedListServiceValidator;

    private constructor() {
        this.repository = new UserRepository();
        this.validator = new BlockedListServiceValidator();
    }

    static create(): UserInfoService {
        return new UserInfoService();
    }

    async getUser(options: FilterQuery<IUser>): Promise<HydratedDocument<IUser>> {
        const user = await this.repository.findOne(options);
        this.validator.validateGet(user);

        return user;
    }

    async linkUser(options: FilterQuery<IUser>): Promise<HydratedDocument<IUser>> {
        this.validator.validateLinkUser(options);

        const user = await this.repository.findOne({ mcUuid: options.mcUuid });
        this.validator.validateGetEmpty(user);

        return this.repository.update({ discordUuid: options.discordUuid }, options);
    }

    async updateUser(options: FilterQuery<IUser>, update: FilterQuery<IUser>): Promise<HydratedDocument<IUser>> {
        const _ = await this.getUser(options);
        return await this.repository.update(options, update);
    }

    async getBlockedList(userId: FilterQuery<IUser>): Promise<string[]> {
        const user = await this.getUser(userId);

        return user.blocked;
    }

    async addToBlockedList(userId: FilterQuery<IUser>, toBlock: string): Promise<IUser> {
        const user = await this.getUser(userId);
        this.validator.validateAddToBlockedList(user, toBlock);

        user.blocked.push(toBlock);

        return await this.repository.update({ uuid: user.mcUuid }, user);
    }

    async removeFromBlockedList(userId: FilterQuery<IUser>, toRemove: string): Promise<void> {
        const user = await this.getUser(userId);
        this.validator.validateRemoveFromBlockedList(user, toRemove);

        user.blocked = user.blocked.filter((blockedUser) => blockedUser !== toRemove);

        await this.repository.update({ uuid: user.mcUuid }, user);
    }
}

class BlockedListServiceValidator {
    validateGet(user: IUser | null): asserts user is IUser {
        if (!user) {
            throw new NotFoundError(UserErrors.NOT_FOUND);
        }
    }

    validateGetEmpty(user: IUser | null): asserts user is null {
        if (user) {
            throw new ValidationError(UserErrors.ALREADY_LINKED);
        }
    }

    validateLinkUser(options: FilterQuery<IUser>): asserts options is IUser {
        if (!options.discordUuid || !options.mcUuid) {
            throw new ValidationError(UserErrors.MISSING_PARAMS);
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
