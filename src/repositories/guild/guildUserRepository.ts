import { IGuildUser } from "../../models/schemas/guildUserSchema.js";
import { BaseRepository } from "../base/baseRepository.js";

import { Model } from "mongoose";

export class GuildUserRepository extends BaseRepository<IGuildUser> {
    constructor(GuildUserModel: Model<IGuildUser>) {
        super(GuildUserModel);
    }
}
