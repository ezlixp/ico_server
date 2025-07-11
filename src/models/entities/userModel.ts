import mongoose, { Model, Schema } from "mongoose";
import { BaseModel } from "./baseModel";

export interface IUser extends BaseModel {
    mcUuid: string;
    discordUuid: string;
    blocked: string[];
    banned: boolean;
    verified: boolean;
    refreshToken: string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        // insecure
        mcUuid: { type: String, required: true },
        // secure
        discordUuid: { type: String, required: true },
        blocked: { type: [String], required: true, default: [] },
        banned: { type: Boolean, required: true, default: false },
        refreshToken: { type: String, required: true, default: "" },
    },
    {
        collation: { locale: "en", strength: 2 },
    }
);

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
