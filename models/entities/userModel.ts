import mongoose, { Model, Schema } from "mongoose";
import { BaseModel } from "./baseModel.js";

export interface IUser extends BaseModel {
    mcUuid: string;
    discordUuid: string;
    blocked: string[];
    muted: boolean;
    verified: boolean;
}

const userSchema: Schema<IUser> = new Schema(
    {
        mcUuid: { type: String, required: true },
        discordUuid: { type: String, required: true },
        blocked: { type: [String], required: true, default: [] },
        muted: { type: Boolean, required: true, default: false },
        verified: { type: Boolean, required: true, default: false },
    },
    {
        collation: { locale: "en", strength: 2 },
    }
);

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
