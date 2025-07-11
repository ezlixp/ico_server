import { IRepository } from "../../repositories/base/baseRepository";
import { IGuildUser } from "../schemas/guildUserSchema";
import { IRaid } from "../schemas/raidSchema";
import { ITome } from "../schemas/tomeSchema";
import { IWaitlist } from "../schemas/waitlistSchema";

export interface IGuildDatabase {
    GuildUserRepository: IRepository<IGuildUser>;
    RaidRepository: IRepository<IRaid>;
    TomeRepository: IRepository<ITome>;
    WaitlistRepository: IRepository<IWaitlist>;
}

export interface IGuildDatabases {
    [key: string]: IGuildDatabase;
}

/*Supported guilds:
    Idiot Co: b250f587-ab5e-48cd-bf90-71e65d6dc9e7
*/
export const guildIds: { [key: string]: string } = {};

export const guildNames: { [key: string]: string } = {};

export const guildDatabases: IGuildDatabases = {};
