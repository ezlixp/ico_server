import { ValidationError } from "../../errors/implementations/validationError.js";
import { guildDatabases, IGuildDatabases } from "../../models/entities/guildDatabaseModel.js";
import { BaseGuildServiceValidator } from "./baseGuildServiceValidator.js";
import { ITome } from "../../models/schemas/tomeSchema.js";
import { NotFoundError } from "../../errors/implementations/notFoundError.js";
import { TomeErrors } from "../../errors/messages/tomeErrors.js";
import { FilterQuery } from "mongoose";
import { IRepository } from "../../repositories/base/baseRepository.js";

export class TomeService {
    private readonly databases: IGuildDatabases;
    private readonly validator: TomeServiceValidator;

    private constructor() {
        this.databases = guildDatabases;
        this.validator = new TomeServiceValidator();
    }

    static create(): TomeService {
        return new TomeService();
    }

    async getTomeList(wynnGuildId: string): Promise<ITome[]> {
        this.validator.validateGuild(wynnGuildId);
        return this.getRepository(wynnGuildId).find({});
    }

    async addToTomeList(username: FilterQuery<ITome>, wynnGuildId: string): Promise<ITome> {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.getRepository(wynnGuildId);
        const tome = await repository.findOne(username);
        this.validator.validateAddToTomeList(tome, username);

        return repository.create(username);
    }

    async getTomeListPosition(
        username: FilterQuery<ITome>,
        wynnGuildId: string
    ): Promise<{ username: string; position: number }> {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.getRepository(wynnGuildId);
        const tome = await repository.findOne(username);
        this.validator.validateGet(tome);

        const position = (await repository.find({ dateAdded: { $lt: tome.dateAdded.getTime() } })).length + 1;
        return { username: tome.username, position: position };
    }

    async deleteFromTomeList(username: FilterQuery<ITome>, wynnGuildId: string) {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.getRepository(wynnGuildId);
        const tome = await repository.deleteOne(username);
        this.validator.validateGet(tome);
    }

    private getRepository(wynnGuildId: string): IRepository<ITome> {
        return this.databases[wynnGuildId].TomeRepository;
    }
}

class TomeServiceValidator extends BaseGuildServiceValidator {
    public constructor() {
        super();
    }

    validateAddToTomeList(tome: ITome | null, username: FilterQuery<ITome>): asserts username is { username: string } {
        if (tome) {
            throw new ValidationError(TomeErrors.DUPLICATE);
        }
        if (!username.username) {
            throw new ValidationError(TomeErrors.USERNAME_MISSING);
        }
    }

    validateGet(tome: ITome | null): asserts tome is ITome {
        if (!tome) {
            throw new NotFoundError(TomeErrors.NOT_FOUND);
        }
    }
}
