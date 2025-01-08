import { ValidationError } from "../../errors/implementations/validationError.js";
import { guildDatabases } from "../../models/guildDatabaseModel.js";

export abstract class BaseGuildServiceValidator {
    protected constructor() {}

    validateGuild(wynnGuildId: string) {
        if (!(wynnGuildId in guildDatabases) && wynnGuildId !== "*") {
            throw new ValidationError(
                "This guild is not configured. In order to configure a guild, contact a developer."
            );
        }
    }
}
