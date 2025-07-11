import { IWaitlist } from "../../models/schemas/waitlistSchema.js";
import { BaseRepository } from "../base/baseRepository.js";

import { Model } from "mongoose";

export class WaitListRepository extends BaseRepository<IWaitlist> {
    constructor(WaitlistModel: Model<IWaitlist>) {
        super(WaitlistModel);
    }
}
