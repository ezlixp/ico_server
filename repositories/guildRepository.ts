import {BaseRepository, FilterOptions} from "./base/baseRepository.js";
import GuildModel, {IGuild} from "../models/guildModel.js";

export class GuildRepository extends BaseRepository<IGuild> {
    constructor() {
        super(GuildModel);
    }

    async guildExists(wynnGuildId: string): Promise<boolean> {
        return await super.findOne({wynnGuildId}) !== null;
    }
}