import mongoose, { Model, Schema } from "mongoose";

interface IUser extends Document {
    uuid: String;
    guildId: String;
    blocked: [String];
    muted: Boolean;
}

// TODO: figure out how to make collation default without having to add it to each request
const userSchema: Schema<IUser> = new Schema({
    uuid: { type: String, required: true },
    guildId: { type: String, required: true },
    blocked: { type: [String], required: true, default: [] },
    muted: { type: Boolean, required: true, default: false },
});

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
