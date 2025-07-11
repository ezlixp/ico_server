import { BaseRepository } from "./base/baseRepository";
import GuildInfoModel, { IGuildInfo } from "../models/entities/guildInfoModel";

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
