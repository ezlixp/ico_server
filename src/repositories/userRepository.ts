import UserModel, { IUser } from "../models/entities/userModel";
import { BaseRepository } from "./base/baseRepository";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }
}
