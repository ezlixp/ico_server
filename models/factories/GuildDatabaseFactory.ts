import {DatabaseModelFactory} from "./DatabaseModelFactory.js";
import {Connection} from "mongoose";
import {IGuildDatabase} from "../guildDatabaseModel.js";

export class GuildDatabaseFactory {
    private constructor(private readonly modelFactory: DatabaseModelFactory) {
    }

    static create(db: Connection): GuildDatabaseFactory {
        const modelFactory = DatabaseModelFactory.create(db);
        return new GuildDatabaseFactory(modelFactory);
    }

    createDatabase(): IGuildDatabase {
        const guildDatabase: IGuildDatabase = {} as IGuildDatabase;
        guildDatabase.GuildUserModel = this.modelFactory.createGuildUserModel();
        guildDatabase.RaidModel = this.modelFactory.createRaidModel()
        guildDatabase.TomeModel = this.modelFactory.createTomeModel()
        guildDatabase.WaitlistModel = this.modelFactory.createWaitlistModel()
        return guildDatabase;
    }
}