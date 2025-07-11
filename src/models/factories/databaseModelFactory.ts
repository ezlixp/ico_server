import { Connection, Model, Schema } from "mongoose";
import guildUserSchema, { IGuildUser } from "../schemas/guildUserSchema";
import raidSchema, { IRaid } from "../schemas/raidSchema";
import tomeSchema, { ITome } from "../schemas/tomeSchema";
import waitlistSchema, { IWaitlist } from "../schemas/waitlistSchema";

export class DatabaseModelFactory {
    private constructor(private readonly db: Connection) {}

    static create(db: Connection): DatabaseModelFactory {
        return new DatabaseModelFactory(db);
    }

    createGuildUserModel(): Model<IGuildUser> {
        return this.createModel("Guild User", guildUserSchema);
    }

    createRaidModel(): Model<IRaid> {
        return this.createModel("Raid", raidSchema);
    }

    createTomeModel(): Model<ITome> {
        return this.createModel("Tome", tomeSchema);
    }

    createWaitlistModel(): Model<IWaitlist> {
        return this.createModel("Waitlist", waitlistSchema);
    }

    private createModel<T>(name: string, schema: Schema<T>): Model<T> {
        return this.db.model<T>(name, schema);
    }
}
