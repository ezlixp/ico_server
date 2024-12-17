import { Schema } from "mongoose";

export interface IRaid extends Document {
    users: [String];
    raid: String;
    timestamp: Number;
}

const raidSchema: Schema<IRaid> = new Schema({
    users: { type: [String], required: true },
    raid: { type: String, required: true },
    timestamp: { type: Number, required: true },
});

export default raidSchema;
