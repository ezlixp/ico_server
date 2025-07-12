import mongoose, { Model, Schema } from "mongoose";
import { BaseModel } from "./baseModel";

export interface IUser extends BaseModel {
    discordUuid: string;
    mcUuid: string;
    blocked: string[];
    banned: boolean;
    verified: boolean;
    refreshToken: string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        // can be verified to be owned by the person who created the user object
        discordUuid: { type: String, required: true },
        // can be forged
        mcUuid: { type: String, required: true },
        blocked: {
            type: [String],
            required: true,
            validate: {
                validator: function (arr) {
                    return Array.isArray(arr) && arr.every((item) => typeof item === "string" && item !== null);
                },
                message: "test",
            },
            default: [],
        },
        banned: { type: Boolean, required: true, default: false },
        refreshToken: { type: String, required: true, default: "" },
    },
    {
        collation: { locale: "en", strength: 2 },
    }
);

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
