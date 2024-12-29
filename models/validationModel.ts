import mongoose, { Model, Schema } from "mongoose";

interface IValidation {
    validationKey: string;
    wynnGuildId: string;
    guildName: string;
}

// TODO: figure out how to make collation default without having to add it to each request
const userSchema: Schema<IValidation> = new Schema({
    validationKey: { type: String, required: true },
    wynnGuildId: { type: String, required: true },
    guildName: { type: String, required: true },
});

const ValidationModel: Model<IValidation> = mongoose.model("ValidationKey", userSchema);

export default ValidationModel;
