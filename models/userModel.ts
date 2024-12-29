import mongoose, { Model, Schema } from "mongoose";

export interface IUser {
    uuid: string;
    wynnGuildId: string;
    blocked: string[];
    muted: boolean;
}

// TODO: figure out how to make collation default without having to add it to each request
const userSchema: Schema<IUser> = new Schema({
    uuid: { type: String, required: true },
    wynnGuildId: { type: String, required: true },
    blocked: { type: [String], required: true, default: [] },
    muted: { type: Boolean, required: true, default: false },
});

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
