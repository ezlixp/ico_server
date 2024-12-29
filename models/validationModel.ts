import mongoose, { Model, Schema } from "mongoose";

interface IValidation {
    validationKey: string;
    wynnGuildId: string;
    guildName: string;
}

const validationSchema: Schema<IValidation> = new Schema({
    validationKey: { type: String, required: true },
    wynnGuildId: { type: String, required: true },
    guildName: { type: String, required: true },
});

const ValidationModel: Model<IValidation> = mongoose.model("ValidationKey", validationSchema);

export default ValidationModel;
