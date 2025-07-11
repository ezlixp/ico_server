import { BaseRepository } from "./base/baseRepository.js";
import GuildInfoModel, { IGuildInfo } from "../models/entities/guildInfoModel.js";

export class GuildInfoRepository extends BaseRepository<IGuildInfo> {
    constructor() {
        super(GuildInfoModel);
    }

    async guildExists(discordGuildId: string, wynnGuildId: string): Promise<boolean> {
        return (
            (await super.findOne({ $or: [{ wynnGuildId: wynnGuildId }, { discordGuildId: discordGuildId }] })) !== null
        );
    }

    async getAll(): Promise<IGuildInfo[]> {
        return await super.find({});
    }
}
