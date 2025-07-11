import { IWaitlist } from "../../models/schemas/waitlistSchema";
import { BaseRepository } from "../base/baseRepository";

import { Model } from "mongoose";

export class WaitListRepository extends BaseRepository<IWaitlist> {
    constructor(WaitlistModel: Model<IWaitlist>) {
        super(WaitlistModel);
    }
}
