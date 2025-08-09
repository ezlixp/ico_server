import { IRaid } from "../../models/schemas/raidSchema";
import { BaseRepository } from "../base/baseRepository";

import { Model } from "mongoose";

export class RaidRepository extends BaseRepository<IRaid> {
    constructor(RaidModel: Model<IRaid>) {
        super(RaidModel);
    }
}
