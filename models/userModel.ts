import { UUID } from "mongodb";
import mongoose, { Model, Schema } from "mongoose";

interface IUser extends Document {
    username: String;
    uuid: UUID;
    aspects: Number;
    blocked: [String];
}

const userSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true },
    uuid: { type: UUID, required: true },
    aspects: { type: Number, required: true, default: 0 },
    blocked: { type: [String], required: true, default: [] },
});

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
