import { ValidationError } from "../../errors/implementations/validationError.js";
import { guildDatabases, IGuildDatabases } from "../../models/guildDatabaseModel.js";
import { BaseGuildServiceValidator } from "./baseGuildServiceValidator.js";
import { FilterOptions } from "../../repositories/base/baseRepository.js";
import { ITome } from "../../models/schemas/tomeSchema.js";
import { NotFoundError } from "../../errors/implementations/notFoundError.js";
import { TomeErrors } from "../../errors/messages/tomeErrors.js";

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
        return this.databases[wynnGuildId].TomeRepository.find({});
    }

    async addToTomeList(username: FilterOptions, wynnGuildId: string): Promise<ITome> {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.databases[wynnGuildId].TomeRepository;
        const tome = await repository.findOne(username);
        this.validator.validateAddToTomeList(tome, username);

        return repository.create(username);
    }

    async getTomeListPosition(
        username: FilterOptions,
        wynnGuildId: string
    ): Promise<{ username: string; position: number }> {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.databases[wynnGuildId].TomeRepository;
        const tome = await repository.findOne(username);
        this.validator.validateGet(tome);

        const position = (await repository.find({ dateAdded: { $lt: tome.dateAdded.getTime() } })).length + 1;
        return { username: tome.username, position: position };
    }

    async deleteFromTomeList(username: FilterOptions, wynnGuildId: string) {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.databases[wynnGuildId].TomeRepository;
        const tome = await repository.deleteOne(username);
        this.validator.validateGet(tome);
    }
}

class TomeServiceValidator extends BaseGuildServiceValidator {
    public constructor() {
        super();
    }

    validateAddToTomeList(tome: ITome | null, username: FilterOptions): asserts username is { username: string } {
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
