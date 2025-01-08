import mongoose, { Model, Schema } from "mongoose";
import { BaseModel } from "./baseModel.js";

export interface IValidation extends BaseModel {
    validationKey: string;
    wynnGuildId: string;
    wynnGuildName: string;
}

const validationSchema: Schema<IValidation> = new Schema({
    validationKey: { type: String, required: true },
    wynnGuildId: { type: String, required: true },
    wynnGuildName: { type: String, required: true },
});

const ValidationModel: Model<IValidation> = mongoose.model("ValidationKey", validationSchema);

export default ValidationModel;
