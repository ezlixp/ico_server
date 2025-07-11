import { ValidationError } from "../../errors/implementations/validationError";
import { guildDatabases } from "../../models/entities/guildDatabaseModel";
import { GuildErrors } from "../../errors/messages/guildErrors";

export abstract class BaseGuildServiceValidator {
    protected constructor() {}

    validateGuild(wynnGuildId: string) {
        if (!(wynnGuildId in guildDatabases) && wynnGuildId !== "*") {
            throw new ValidationError(GuildErrors.NOT_CONFIGURED);
        }
    }
}
