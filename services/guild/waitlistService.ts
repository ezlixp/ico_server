import { HydratedDocument } from "mongoose";
import { guildDatabases, IGuildDatabases } from "../../models/guildDatabaseModel.js";
import { IWaitlist } from "../../models/schemas/waitlistSchema.js";
import { BaseGuildServiceValidator } from "./baseGuildServiceValidator.js";
import { ValidationError } from "../../errors/implementations/validationError.js";
import { WaitlistErrors } from "../../errors/messages/waitlistErrors.js";
import { NotFoundError } from "../../errors/implementations/notFoundError.js";

export class WaitlistService {
    private readonly databases: IGuildDatabases;
    private readonly validator: WaitlistServiceValidator;
    private constructor() {
        this.databases = guildDatabases;
        this.validator = new WaitlistServiceValidator();
    }

    static create(): WaitlistService {
        return new WaitlistService();
    }

    async getWaitlist(wynnGuildId: string): Promise<IWaitlist[]> {
        this.validator.validateGuild(wynnGuildId);
        const waitlist = await this.databases[wynnGuildId].WaitlistRepository.find({}, {}, { sort: { dateAdded: 1 } });
        return waitlist;
    }

    async addToWaitlist(username: string, wynnGuildId: string): Promise<IWaitlist> {
        this.validator.validateGuild(wynnGuildId);
        const repository = this.databases[wynnGuildId].WaitlistRepository;
        const user = await repository.findOne({ username: username });
        this.validator.validateAddToWaitlist(user);

        return await repository.create({ username: username });
    }

    async removeFromWaitlist(username: string, wynnGuildId: string) {
        const user = await this.databases[wynnGuildId].WaitlistRepository.deleteOne({ username: username });
        this.validator.validateRemoveFromWaitlist(user);
    }
}

class WaitlistServiceValidator extends BaseGuildServiceValidator {
    public constructor() {
        super();
    }

    validateAddToWaitlist(user: HydratedDocument<IWaitlist> | null): asserts user is null {
        if (user) {
            throw new ValidationError(WaitlistErrors.DUPLICATE);
        }
    }

    validateRemoveFromWaitlist(user: HydratedDocument<IWaitlist> | null): asserts user is HydratedDocument<IWaitlist> {
        if (!user) {
            throw new NotFoundError(WaitlistErrors.NOT_FOUND);
        }
    }
}
