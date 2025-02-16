import {ValidationError} from "../../errors/implementations/validationError.js";
import {guildDatabases} from "../../models/entities/guildDatabaseModel.js";
import {GuildErrors} from "../../errors/messages/guildErrors.js";

export abstract class BaseGuildServiceValidator {
    protected constructor() {
    }

    validateGuild(wynnGuildId: string) {
        if (!(wynnGuildId in guildDatabases) && wynnGuildId !== "*") {
            throw new ValidationError(GuildErrors.NOT_CONFIGURED);
        }
    }
}
