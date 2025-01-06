import {BaseRepository} from "./base/BaseRepository.js";
import UserModel, {IUser} from "../models/userModel.js";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }
}