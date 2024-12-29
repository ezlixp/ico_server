import { guildDatabases } from "../models/guildDatabaseModel.js";
import { usernameToUuid } from "../net/mojangApiClient.js";

/** Decrements the number of aspects owed to a user by 1
 * @param username The user to decrement from
 * @param guildId The guild id of the user
 */
export async function decrementAspects(username: string, guildId: string): Promise<void> {
    guildDatabases[guildId].GuildUserModel.updateOne(
        { uuid: await usernameToUuid(username) },
        { username: username, $inc: { aspects: -1 } },
        {
            upsert: true,
            collation: { locale: "en", strength: 2 },
        }
    ).then(() => {
        console.log(username, "received an aspect");
    });
}
/** Increments the number of aspects owed to a user by 0.5
 * @param username The user to increment from
 * @param guildId The guild
 */
export async function incrementAspects(username: string, guildId: string): Promise<void> {
    guildDatabases[guildId].GuildUserModel.updateOne(
        { uuid: await usernameToUuid(username) },
        { username: username, $inc: { aspects: 0.5, raids: 1 } },
        {
            upsert: true,
            collation: { locale: "en", strength: 2 },
        }
    ).then(() => {
        console.log(username, "is owed half an aspect");
    });
}

export async function deleteTome(username: string, guildId: string): Promise<void> {
    guildDatabases[guildId].TomeModel.findOneAndDelete({ usernam: username }).then(() => {
        console.log(username, "got a tome");
    });
}
