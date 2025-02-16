import mongoose, { Model, Schema } from "mongoose";
import { BaseModel } from "./baseModel.js";

export interface IUser extends BaseModel {
    uuid: string;
    wynnGuildId: string;
    blocked: string[];
    muted: boolean;
}

const userSchema: Schema<IUser> = new Schema(
    {
        uuid: { type: String, required: true },
        wynnGuildId: { type: String, required: true },
        blocked: { type: [String], required: true, default: [] },
        muted: { type: Boolean, required: true, default: false },
    },
    {
        collation: { locale: "en", strength: 2 },
    }
);

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
