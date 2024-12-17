import mongoose, { Model } from "mongoose";
import guildUserSchema, { IGuildUser } from "./schemas/guildUserSchema.js";
import raidSchema, { IRaid } from "./schemas/raidSchema.js";
import tomeSchema, { ITome } from "./schemas/tomeSchema.js";
import waitlistSchema, { IWaitlist } from "./schemas/waitlistSchema.js";

interface IGuildDatabase {
    GuildUserModel: Model<IGuildUser>;
    RaidModel: Model<IRaid>;
    TomeModel: Model<ITome>;
    WaitlistModel: Model<IWaitlist>;
}
interface IGuildDatabases {
    [key: string]: IGuildDatabase;
}

export const guildIds = {
    "!dev": "**",

    "Idiot+Co": "b250f587-ab5e-48cd-bf90-71e65d6dc9e7",
};

export const guildNames = {
    "**": "!dev",

    "b250f587-ab5e-48cd-bf90-71e65d6dc9e7": "Idiot+Co",
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
export default function registerDatabases() {
    Object.entries(guildIds).forEach((value) => {
        const dbName = value[0];
        const db = mongoose.connection.useDb(dbName);
        const guildDatabase: IGuildDatabase = {} as IGuildDatabase;
        guildDatabase.GuildUserModel = db.model("Guild User", guildUserSchema);
        guildDatabase.RaidModel = db.model("Raid", raidSchema);
        guildDatabase.TomeModel = db.model("Tome", tomeSchema);
        guildDatabase.WaitlistModel = db.model("Waitlist", waitlistSchema);
        guildDatabases[value[1]] = guildDatabase;
    });
}
