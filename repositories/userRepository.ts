import UserModel, { IUser } from "../models/userModel.js";
import { BaseRepository } from "./base/baseRepository.js";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }
}
