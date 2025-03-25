import 'reflect-metadata';
import { IUser } from './user.model.js';
import { NotFoundError } from '../../errors/implementations/notFoundError.js';
import { UserErrors } from './user.errors.js';
import { ValidationError } from '../../errors/implementations/validationError.js';
import { injectable } from 'tsyringe';

@injectable()
export class UserValidator {
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
