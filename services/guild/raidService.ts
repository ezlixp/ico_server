import { guildDatabases, IGuildDatabases } from "../../models/guildDatabaseModel.js";
import { BaseGuildServiceValidator } from "./baseGuildServiceValidator.js";
import { ILeaderboardUser, IRaid, IRaidRewardsResponse } from "../../models/schemas/raidSchema.js";
import { uuidToUsername } from "../../net/mojangApiClient.js";
import { FilterQuery, HydratedDocument } from "mongoose";
import { IGuildUser } from "../../models/schemas/guildUserSchema.js";
import { NotFoundError } from "../../errors/implementations/notFoundError.js";
import { RaidErrors } from "../../errors/messages/raidErrors.js";
import { DatabaseError } from "../../errors/implementations/databaseError.js";

export class RaidService {
    private readonly databases: IGuildDatabases;
    private readonly validator: RaidServiceValidator;
    private constructor() {
        this.databases = guildDatabases;
        this.validator = new RaidServiceValidator();
    }

    static create(): RaidService {
        return new RaidService();
    }

    async getRaids(wynnGuildId: string): Promise<IRaid[]> {
        this.validator.validateGuild(wynnGuildId);
        return await this.databases[wynnGuildId].RaidRepository.find({});
    }

    async getRewards(wynnGuildId: string): Promise<IRaidRewardsResponse[]> {
        this.validator.validateGuild(wynnGuildId);
        const users = await this.databases[wynnGuildId].GuildUserRepository.find({
            $or: [{ aspects: { $gte: 1 } }, { emeralds: { $gt: 0 } }],
        });
        const res: IRaidRewardsResponse[] = [];
        for (var i = 0; i < users.length; ++i) {
            res.push({
                username: await uuidToUsername(users[i].uuid),
                raids: users[i].raids,
                aspects: users[i].aspects,
                liquidEmeralds: users[i].emeralds / 4096,
            });
        }
        return res;
    }

    async updateRewards(
        update: FilterQuery<IRaid>,
        aspects: number | null,
        emeralds: number | null,
        wynnGuildId: string
    ): Promise<HydratedDocument<IGuildUser>> {
        this.validator.validateGuild(wynnGuildId);
        const toUpdate = await this.databases[wynnGuildId].GuildUserRepository.findOne(update);
        this.validator.validateUpdateRewards(toUpdate);

        if (aspects) toUpdate.aspects -= aspects;
        if (emeralds) toUpdate.emeralds -= emeralds;

        try {
            await toUpdate.save();
        } catch (e) {
            throw new DatabaseError();
        }
        return toUpdate;
    }

    async getUserRewards(filter: FilterQuery<IGuildUser>, wynnGuildId: string): Promise<IRaidRewardsResponse> {
        this.validator.validateGuild(wynnGuildId);
        const user = await this.databases[wynnGuildId].GuildUserRepository.findOne(filter);
        this.validator.validateGetUserRewards(user);
        const res: IRaidRewardsResponse = {
            username: await uuidToUsername(user.uuid),
            raids: user.raids,
            aspects: user.aspects,
            liquidEmeralds: user.emeralds / 4096,
        };
        console.log(user);
        return res;
    }

    async getRaidsLeaderboard(wynnGuildId: string): Promise<ILeaderboardUser[]> {
        this.validator.validateGuild(wynnGuildId);
        const users = await this.databases[wynnGuildId].GuildUserRepository.find(
            { raids: { $gt: 0 } },
            {},
            { sort: { raids: "descending" } }
        );
        let formattedTopUsers: ILeaderboardUser[] = [];
        // TODO implement mojang api bulk uuid to username call
        for (let i = 0; i < users.length; i++) {
            formattedTopUsers.push({
                username: await uuidToUsername(users[i].uuid),
                raids: users[i].raids,
            });
        }
        return formattedTopUsers;
    }
}

class RaidServiceValidator extends BaseGuildServiceValidator {
    public constructor() {
        super();
    }

    validateUpdateRewards(
        toUpdate: HydratedDocument<IGuildUser> | null
    ): asserts toUpdate is HydratedDocument<IGuildUser> {
        if (!toUpdate) {
            throw new NotFoundError(RaidErrors.NOT_FOUND);
        }
    }

    validateGetUserRewards(user: HydratedDocument<IGuildUser> | null): asserts user is HydratedDocument<IGuildUser> {
        if (!user) {
            throw new NotFoundError(RaidErrors.NOT_FOUND);
        }
    }
}
