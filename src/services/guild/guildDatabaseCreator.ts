import { guildDatabases, guildIds, guildNames } from "../../models/entities/guildDatabaseModel";
import { GuildDatabaseFactory } from "../../models/factories/guildDatabaseFactory";
import mongoose from "mongoose";
import Services from "../services";

export class GuildDatabaseCreator {
    private constructor() {}

    static create(): GuildDatabaseCreator {
        return new GuildDatabaseCreator();
    }

    createNewDatabase(wynnGuildName: string, wynnGuildId: string) {
        if (Object.keys(guildIds).indexOf(wynnGuildName) != -1) {
            if (process.env.NODE_ENV !== "test")
                console.warn("trying to register already existing database:", wynnGuildName);
            return;
        }
        guildIds[wynnGuildName] = wynnGuildId;
        guildNames[wynnGuildId] = wynnGuildName;
        this.registerDatabase([wynnGuildName, wynnGuildId]);
    }

    registerDatabase(value: [string, string]) {
        if (process.env.NODE_ENV !== "test") console.log(value);

        const dbName = value[0];
        const db = mongoose.connection.useDb(dbName);
        const databaseFactory = GuildDatabaseFactory.create(db);

        guildDatabases[value[1]] = databaseFactory.createDatabase();
    }

    private dropDatabase(guild: string) {
        const dbName = guild;
        const db = mongoose.connection.useDb(dbName);
        db.dropDatabase();
    }

    public async dropDatabases() {
        if (process.env.NODE_ENV !== "test")
            throw new Error("This function should not be called outside of a testing environment.");

        for (const prop of Object.getOwnPropertyNames(guildDatabases)) delete guildDatabases[prop];
        for (const [guildId, name] of Object.entries(guildNames)) {
            this.dropDatabase(name);
        }
    }

    async registerDatabases() {
        const guilds = await Services.guildInfo.getAll();

        for (let i = 0; i < guilds.length; ++i) {
            const name = guilds[i].wynnGuildName.replaceAll(" ", "+");
            const guildId = guilds[i].wynnGuildId;
            guildIds[name] = guildId;
            guildNames[guildId] = name;
        }

        console.log("registered guilds:", JSON.stringify(guildIds, null, 2));
        Object.entries(guildIds).forEach((value) => {
            this.registerDatabase(value);
        });
    }
}

