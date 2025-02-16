import mongoose, {Model, Schema} from "mongoose";
import {BaseModel} from "./baseModel.js";

export interface IGuild extends BaseModel {
    validationKey: string;
    wynnGuildId: string;
    wynnGuildName: string;
}

export class GuildImpl implements IGuild {
    validationKey: string;
    wynnGuildId: string;
    wynnGuildName: string;

    constructor(validationKey: string, wynnGuildId: string, wynnGuildName: string) {
        this.validationKey = validationKey;
        this.wynnGuildId = wynnGuildId;
        this.wynnGuildName = wynnGuildName
        this.wynnGuildName = wynnGuildName
    }
}

const validationSchema: Schema<IGuild> = new Schema({
    validationKey: {type: String, required: true},
    wynnGuildId: {type: String, required: true},
    wynnGuildName: {type: String, required: true},
});

const GuildModel: Model<IGuild> = mongoose.model("ValidationKey", validationSchema);

export default GuildModel;
