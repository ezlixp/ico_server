import mongoose, { Model, Schema } from "mongoose";

interface IValidation extends Document {
    validationKey: String;
    guildId: String;
    guildName: String;
}

// TODO: figure out how to make collation default without having to add it to each request
const userSchema: Schema<IValidation> = new Schema({
    validationKey: { type: String, required: true },
    guildId: { type: String, required: true },
    guildName: { type: String, required: false },
});

const ValidationModel: Model<IValidation> = mongoose.model("ValidationKey", userSchema);

export default ValidationModel;
