import { guildDatabases } from "../models/entities/guildDatabaseModel";
import { usernameToUuid } from "../communication/httpClients/mojangApiClient";

/** Decrements the number of aspects owed to a user by 1
 * @param mcUsername The user to decrement from
 * @param guildId The guild id of the user
 */
export async function decrementAspects(mcUsername: string, guildId: string): Promise<void> {
    guildDatabases[guildId].GuildUserRepository.update(
        { uuid: await usernameToUuid(mcUsername) },
        { $inc: { aspects: -1 } }
    ).then(() => {
        console.log(mcUsername, "received an aspect");
    });
}
/** Increments the number of aspects owed to a user by 0.5
 * @param mcUsername The user to increment from
 * @param guildId The guild
 */
export async function incrementAspects(mcUsername: string, guildId: string): Promise<void> {
    try {
        guildDatabases[guildId].GuildUserRepository.update(
            { uuid: await usernameToUuid(mcUsername) },
            { $inc: { aspects: 0.5, raids: 1, emeralds: 512 } }
        ).then(() => {
            console.log(mcUsername, "is owed half an aspect");
        });
    } catch (error) {
        console.error("increment aspects error:", error);
    }
}

export async function deleteTome(username: string, guildId: string): Promise<void> {
    guildDatabases[guildId].TomeRepository.deleteOne({ mcUsername: username }).then((document) => {
        if (!document) console.warn("tried to delete tome from non-existant player:", username);
        else console.log(username, "got a tome");
    });
}
