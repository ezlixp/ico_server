import { IRaid } from "../../models/schemas/raidSchema.js";
import { BaseRepository } from "../base/baseRepository.js";

import { Model } from "mongoose";

export class RaidRepository extends BaseRepository<IRaid> {
    constructor(RaidModel: Model<IRaid>) {
        super(RaidModel);
    }
}
