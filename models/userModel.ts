import mongoose, {Model, Schema} from "mongoose";

interface IUser extends Document {
    username: String;
    aspects: Number;
}

const userSchema: Schema<IUser> = new Schema({
    username: {type: String, required: true},
    aspects: {type: Number, required: true},
});

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
