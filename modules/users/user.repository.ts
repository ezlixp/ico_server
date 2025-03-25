import 'reflect-metadata';
import UserModel, { IUser } from './user.model.js';
import { BaseRepository } from '../../repositories/base/baseRepository.js';
import { injectable } from 'tsyringe';

@injectable()
export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }
}
