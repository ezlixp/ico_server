import { GuildDatabaseCreator } from '../../services/guild/guildDatabaseCreator.js';
import { GuildRepository } from '../../repositories/guildRepository.js';
import { IGuild } from '../../models/entities/guildModel.js';
import { ValidationError } from '../../errors/implementations/validationError.js';
import { injectable } from 'tsyringe';

@injectable()
export class GuildService {
    private readonly guildRepository: GuildRepository;
    private readonly guildDatabaseCreator: GuildDatabaseCreator;

    constructor() {
        this.guildRepository = new GuildRepository();
        this.guildDatabaseCreator = new GuildDatabaseCreator();
    }

    async createNewGuild(guildRequest: IGuild): Promise<IGuild> {
        await this.validationNewGuildCreation(guildRequest.wynnGuildId);

        const newGuild = await this.guildRepository.create(guildRequest);
        this.guildDatabaseCreator.createNewDatabase(
            newGuild.wynnGuildName,
            newGuild.wynnGuildId,
        );

        return newGuild;
    }

    private async validationNewGuildCreation(wynnGuildId: string) {
        if (await this.guildRepository.guildExists(wynnGuildId)) {
            throw new ValidationError(
                'A guild with the same Id is already registered.',
            );
        }
    }
}
