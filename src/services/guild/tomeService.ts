import { ValidationError } from "../../errors/implementations/validationError";
import { guildDatabases, IGuildDatabases } from "../../models/entities/guildDatabaseModel";
import { BaseGuildServiceValidator } from "./baseGuildServiceValidator";
import { ITome } from "../../models/schemas/tomeSchema";
import { NotFoundError } from "../../errors/implementations/notFoundError";
import { TomeErrors } from "../../errors/messages/tomeErrors";
import { FilterQuery } from "mongoose";
import { IRepository } from "../../repositories/base/baseRepository";

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

    async addToTomeList(mcUsername: FilterQuery<ITome>, wynnGuildId: string): Promise<ITome> {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.getRepository(wynnGuildId);
        const tome = await repository.findOne(mcUsername);
        this.validator.validateAddToTomeList(tome, mcUsername);

        return repository.create(mcUsername);
    }

    async getTomeListPosition(
        mcUsername: FilterQuery<ITome>,
        wynnGuildId: string
    ): Promise<{ mcUsername: string; position: number }> {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.getRepository(wynnGuildId);
        const tome = await repository.findOne(mcUsername);
        this.validator.validateGet(tome);

        const position = (await repository.find({ dateAdded: { $lt: tome.dateAdded.getTime() } })).length + 1;
        return { mcUsername: tome.mcUsername, position: position };
    }

    async deleteFromTomeList(mcUsername: string, wynnGuildId: string) {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.getRepository(wynnGuildId);
        const tome = await repository.deleteOne({ mcUsername: mcUsername });
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

    validateAddToTomeList(
        tome: ITome | null,
        mcUsername: FilterQuery<ITome>
    ): asserts mcUsername is { mcUsername: string } {
        if (tome) {
            throw new ValidationError(TomeErrors.TOME_DUPLICATE);
        }
        if (!mcUsername.mcUsername) {
            throw new ValidationError(TomeErrors.USERNAME_MISSING);
        }
    }

    validateGet(tome: ITome | null): asserts tome is ITome {
        if (!tome) {
            throw new NotFoundError(TomeErrors.TOME_NOT_FOUND);
        }
    }
}

