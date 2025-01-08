import mongoose, { Model, Schema } from "mongoose";

export interface IValidation {
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
