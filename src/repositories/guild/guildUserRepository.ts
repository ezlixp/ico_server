import { IGuildUser } from "../../models/schemas/guildUserSchema";
import { BaseRepository } from "../base/baseRepository";

import { Model } from "mongoose";

export class GuildUserRepository extends BaseRepository<IGuildUser> {
    constructor(GuildUserModel: Model<IGuildUser>) {
        super(GuildUserModel);
    }
}
