import { guildDatabases } from "../models/guildDatabaseModel.js";
import { usernameToUuid } from "../net/mojangApiClient.js";

/** Decrements the number of aspects owed to a user by 1
 * @param username The user to decrement from
 * @param guildId The guild id of the user
 */
export async function decrementAspects(username: string, guildId: string): Promise<void> {
    guildDatabases[guildId].GuildUserRepository.update(
        { uuid: await usernameToUuid(username) },
        { $inc: { aspects: -1 } }
    ).then(() => {
        console.log(username, "received an aspect");
    });
}
/** Increments the number of aspects owed to a user by 0.5
 * @param username The user to increment from
 * @param guildId The guild
 */
export async function incrementAspects(username: string, guildId: string): Promise<void> {
    guildDatabases[guildId].GuildUserRepository.update(
        { uuid: await usernameToUuid(username) },
        { $inc: { aspects: 0.5, raids: 1 } }
    ).then(() => {
        console.log(username, "is owed half an aspect");
    });
}

export async function deleteTome(username: string, guildId: string): Promise<void> {
    guildDatabases[guildId].TomeRepository.deleteOne({ username: username }).then((document) => {
        if (!document) console.warn("tried to delete tome from non-existant player:", username);
        else console.log(username, "got a tome");
    });
}
