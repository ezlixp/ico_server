import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
	user: {type: String, required: true},
	aspects: {type: Number, required: true},
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
