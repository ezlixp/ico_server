import mongoose, { Model } from "mongoose";
import guildUserSchema, { IGuildUser } from "./schemas/guildUserSchema.js";
import raidSchema, { IRaid } from "./schemas/raidSchema.js";
import tomeSchema, { ITome } from "./schemas/tomeSchema.js";
import waitlistSchema, { IWaitlist } from "./schemas/waitlistSchema.js";
import ValidationModel from "./validationModel.js";

interface IGuildDatabase {
    GuildUserModel: Model<IGuildUser>;
    RaidModel: Model<IRaid>;
    TomeModel: Model<ITome>;
    WaitlistModel: Model<IWaitlist>;
}
interface IGuildDatabases {
    [key: string]: IGuildDatabase;
}

/*Supported guilds:
    Idiot Co: b250f587-ab5e-48cd-bf90-71e65d6dc9e7
*/
export const guildIds: { [key: string]: string } = {
    "!dev": "**",
};

export const guildNames: { [key: string]: string } = {
    "**": "!dev",
};

export const guildDatabases: IGuildDatabases = {};

/**
 * Creates collection in each guild's database for each of the following schemas:
 *
 * {@link guildUserSchema}
 * {@link raidSchema}
 * {@link tomeSchema}
 * {@link waitlistSchema}
 */
export function newDatabase(wynnGuildName: string, wynnGuildId: string) {
    if (Object.keys(guildIds).indexOf(wynnGuildName) != -1) {
        console.warn("trying to register already existing database:", wynnGuildName);
        return;
    }
    guildIds[wynnGuildName] = wynnGuildId;
    guildNames[wynnGuildId] = wynnGuildName;
    registerDatabase([wynnGuildName, wynnGuildId]);
}

export function registerDatabase(value: [string, string]) {
    console.log(value);
    const dbName = value[0];
    const db = mongoose.connection.useDb(dbName);
    const guildDatabase: IGuildDatabase = {} as IGuildDatabase;
    guildDatabase.GuildUserModel = db.model("Guild User", guildUserSchema);
    guildDatabase.RaidModel = db.model("Raid", raidSchema);
    guildDatabase.TomeModel = db.model("Tome", tomeSchema);
    guildDatabase.WaitlistModel = db.model("Waitlist", waitlistSchema);
    guildDatabases[value[1]] = guildDatabase;
}

export default async function registerDatabases() {
    const guilds = await ValidationModel.find().exec();
    for (let i = 0; i < guilds.length; ++i) {
        const name = guilds[i].wynnGuildName.replaceAll(" ", "+");
        const guildId = guilds[i].wynnGuildId;
        guildIds[name] = guildId;
        guildNames[guildId] = name;
    }
    console.log("registered guilds:", JSON.stringify(guildIds, null, 2));
    Object.entries(guildIds).forEach((value) => {
        registerDatabase(value);
    });
}
