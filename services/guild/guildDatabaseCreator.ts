import {guildDatabases, guildIds, guildNames} from "../../models/guildDatabaseModel.js";
import {GuildDatabaseFactory} from "../../models/factories/guildDatabaseFactory.js";
import mongoose from "mongoose";
import {GuildRepository} from "../../repositories/guildRepository.js";

export class GuildDatabaseCreator {
    private readonly validationRepository = new GuildRepository();

    constructor() {
        this.validationRepository = new GuildRepository();
    }

    createNewDatabase(wynnGuildName: string, wynnGuildId: string) {
        if (Object.keys(guildIds).indexOf(wynnGuildName) != -1) {
            console.warn("trying to register already existing database:", wynnGuildName);
            return;
        }
        guildIds[wynnGuildName] = wynnGuildId;
        guildNames[wynnGuildId] = wynnGuildName;
        this.registerDatabase([wynnGuildName, wynnGuildId]);
    }

    registerDatabase(value: [string, string]) {
        console.log(value);

        const dbName = value[0];
        const db = mongoose.connection.useDb(dbName);
        const databaseFactory = GuildDatabaseFactory.create(db);

        guildDatabases[value[1]] = databaseFactory.createDatabase();
    }

    async registerDatabases() {
        const guilds = await this.validationRepository.find();
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
