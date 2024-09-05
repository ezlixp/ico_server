import mongoose, { Model, Schema } from "mongoose";

interface IRaid extends Document {
    users: [String];
    raid: String;
    timestamp: Number;
}

const raidSchema: Schema<IRaid> = new Schema({
    users: { type: [String], required: true },
    raid: { type: String, required: true },
    timestamp: { type: Number, required: true },
});

const RaidModel: Model<IRaid> = mongoose.model("Raid", raidSchema);

export default RaidModel;
