import {GuildDatabaseCreator} from "./guildDatabaseCreator.js";
import {GuildRepository} from "../../repositories/guildRepository.js";
import {IGuild} from "../../models/guildModel.js";
import {ValidationError} from "../../errors/implementations/validationError.js";

export class GuildService {
    private readonly guildRepository: GuildRepository;
    private readonly guildDatabaseCreator: GuildDatabaseCreator;

    private constructor() {
        this.guildRepository = new GuildRepository();
        this.guildDatabaseCreator = new GuildDatabaseCreator();
    }

    static create() {
        return new GuildService();
    }

    async createNewGuild(guildRequest: IGuild): Promise<IGuild> {
        await this.validationNewGuildCreation(guildRequest.wynnGuildId);

        const newGuild = await this.guildRepository.create(guildRequest);
        this.guildDatabaseCreator.createNewDatabase(newGuild.wynnGuildName, newGuild.wynnGuildId);

        return newGuild;
    }

    private async validationNewGuildCreation(wynnGuildId: string) {
        if (await this.guildRepository.guildExists(wynnGuildId)) {
            throw new ValidationError("A guild with the same Id is already registered.");
        }
    }
}