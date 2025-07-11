import { DatabaseModelFactory } from "./databaseModelFactory";
import { Connection } from "mongoose";
import { IGuildDatabase } from "../entities/guildDatabaseModel";
import { GuildUserRepository } from "../../repositories/guild/guildUserRepository";
import { RaidRepository } from "../../repositories/guild/raidRepository";
import { TomeRepository } from "../../repositories/guild/tomeRepository";
import { WaitListRepository } from "../../repositories/guild/waitlistRepository";

export class GuildDatabaseFactory {
    private constructor(private readonly modelFactory: DatabaseModelFactory) {}

    static create(db: Connection): GuildDatabaseFactory {
        const modelFactory = DatabaseModelFactory.create(db);

        return new GuildDatabaseFactory(modelFactory);
    }

    createDatabase(): IGuildDatabase {
        const guildDatabase: IGuildDatabase = {} as IGuildDatabase;

        guildDatabase.GuildUserRepository = new GuildUserRepository(this.modelFactory.createGuildUserModel());
        guildDatabase.RaidRepository = new RaidRepository(this.modelFactory.createRaidModel());
        guildDatabase.TomeRepository = new TomeRepository(this.modelFactory.createTomeModel());
        guildDatabase.WaitlistRepository = new WaitListRepository(this.modelFactory.createWaitlistModel());

        return guildDatabase;
    }
}
