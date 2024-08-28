import mongoose from "mongoose";

const Schema = mongoose.Schema;
const raidSchema = new Schema({
	users: {type: [String], required: true},
	raid: {type: String, required: true},
	timestamp: {type: Number, required: true},
});

const RaidModel = mongoose.model("Raid", raidSchema);

export default RaidModel;
