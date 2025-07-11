import { BaseRepository } from "../base/baseRepository.js";
import { ITome } from "../../models/schemas/tomeSchema.js";
import { Model } from "mongoose";

export class TomeRepository extends BaseRepository<ITome> {
    constructor(TomeModel: Model<ITome>) {
        super(TomeModel);
    }
}
