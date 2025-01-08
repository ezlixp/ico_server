import { IRepository } from "../repositories/base/baseRepository.js";
import { IGuildUser } from "./schemas/guildUserSchema.js";
import { IRaid } from "./schemas/raidSchema.js";
import { ITome } from "./schemas/tomeSchema.js";
import { IWaitlist } from "./schemas/waitlistSchema.js";

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
export const guildIds: { [key: string]: string } = {
    "!dev": "**",
};

export const guildNames: { [key: string]: string } = {
    "**": "!dev",
};

export const guildDatabases: IGuildDatabases = {};
