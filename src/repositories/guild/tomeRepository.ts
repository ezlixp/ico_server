import { BaseRepository } from "../base/baseRepository";
import { ITome } from "../../models/schemas/tomeSchema";
import { Model } from "mongoose";

export class TomeRepository extends BaseRepository<ITome> {
    constructor(TomeModel: Model<ITome>) {
        super(TomeModel);
    }
}
