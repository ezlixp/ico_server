import {BaseRepository} from "./base/baseRepository.js";
import GuildModel, {IGuild} from "../models/entities/guildModel.js";

export class GuildRepository extends BaseRepository<IGuild> {
    constructor() {
        super(GuildModel);
    }

    async guildExists(wynnGuildId: string): Promise<boolean> {
        return await super.findOne({wynnGuildId}) !== null;
    }

    async getAll(): Promise<IGuild[]> {
        return await super.find({})
    }
}