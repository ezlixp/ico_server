import { HydratedDocument } from "mongoose";
import { ValidationError } from "../errors/implementations/validationError";
import { IGuildInfo, IGuildInfoOptionals } from "../models/entities/guildInfoModel";
import { GuildInfoRepository } from "../repositories/guildInfoRepository";
import { GuildDatabaseCreator } from "./guild/guildDatabaseCreator";

export class GuildInfoService {
    private readonly guildDatabaseCreator: GuildDatabaseCreator;
    private readonly validator: GuildInfoServiceValidator;
    private readonly repository: GuildInfoRepository;

    private constructor() {
        this.guildDatabaseCreator = new GuildDatabaseCreator();
        this.validator = new GuildInfoServiceValidator();
        this.repository = new GuildInfoRepository();
    }

    public static create() {
        return new GuildInfoService();
    }

    public async createNewGuild(guildRequest: IGuildInfo): Promise<IGuildInfo> {
        await this.validateNewGuildCreation(guildRequest.discordGuildId, guildRequest.wynnGuildId);

        const newGuild = await this.repository.create(guildRequest);
        this.guildDatabaseCreator.createNewDatabase(newGuild.wynnGuildName, newGuild.wynnGuildId);

        return newGuild;
    }

    public async upsertGuildInfo(
        guild: HydratedDocument<IGuildInfo>,
        update: Partial<IGuildInfoOptionals>
    ): Promise<IGuildInfo> {
        const { privilegedRoles, mutedUuids, ...rest } = guild;

        guild.updateOne(rest);
        guild.updateOne({ $push: { privilegedRoles: { $each: privilegedRoles }, mutedUuids: { $each: mutedUuids } } });
        guild.save();
        return guild;
    }

    public async validateNewGuildCreation(discordGuildId: string, wynnGuildId: string) {
        if (await this.repository.guildExists(discordGuildId, wynnGuildId)) {
            throw new ValidationError("A guild with the same Id is already registered.");
        }
    }

    public async getAll() {
        return await this.repository.getAll();
    }
}

class GuildInfoServiceValidator {}
