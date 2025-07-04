import { GuildDatabaseCreator } from "./guildDatabaseCreator.js";
import { IGuild } from "../../models/entities/guildModel.js";
import { ValidationError } from "../../errors/implementations/validationError.js";
import Repositories from "../../repositories/repositories.js";

export class GuildService {
    private readonly guildDatabaseCreator: GuildDatabaseCreator;

    private constructor() {
        this.guildDatabaseCreator = new GuildDatabaseCreator();
    }

    static create() {
        return new GuildService();
    }

    async createNewGuild(guildRequest: IGuild): Promise<IGuild> {
        await this.validationNewGuildCreation(guildRequest.wynnGuildId);

        const newGuild = await Repositories.guild.create(guildRequest);
        this.guildDatabaseCreator.createNewDatabase(newGuild.wynnGuildName, newGuild.wynnGuildId);

        return newGuild;
    }

    private async validationNewGuildCreation(wynnGuildId: string) {
        if (await Repositories.guild.guildExists(wynnGuildId)) {
            throw new ValidationError("A guild with the same Id is already registered.");
        }
    }
}
