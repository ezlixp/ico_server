import { GuildDatabaseCreator } from "./guildDatabaseCreator.js";
import { IGuild } from "../../models/entities/guildModel.js";
import { ValidationError } from "../../errors/implementations/validationError.js";
import { GuildRepository } from "../../repositories/guildRepository.js";

export class GuildService {
    private readonly guildDatabaseCreator: GuildDatabaseCreator;
    private readonly repository: GuildRepository;

    private constructor() {
        this.guildDatabaseCreator = new GuildDatabaseCreator();
        this.repository = new GuildRepository();
    }

    static create() {
        return new GuildService();
    }

    async createNewGuild(guildRequest: IGuild): Promise<IGuild> {
        await this.validationNewGuildCreation(guildRequest.wynnGuildId);

        const newGuild = await this.repository.create(guildRequest);
        this.guildDatabaseCreator.createNewDatabase(newGuild.wynnGuildName, newGuild.wynnGuildId);

        return newGuild;
    }

    private async validationNewGuildCreation(wynnGuildId: string) {
        if (await this.repository.guildExists(wynnGuildId)) {
            throw new ValidationError("A guild with the same Id is already registered.");
        }
    }

    async getAll() {
        return await this.repository.getAll();
    }
}
