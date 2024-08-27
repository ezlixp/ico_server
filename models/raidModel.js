import mongoose from "mongoose";

const schema = mongoose.Schema;
const raidSchema = new schema({
    users: { type: [String], required: true },
    raid: { type: String, required: true },
    timestamp: { type: Number, required: true },
});

const raidModel = mongoose.model("Raid", raidSchema);

export default raidModel;
