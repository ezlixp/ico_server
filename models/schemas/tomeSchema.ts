import { Schema } from "mongoose";

export interface ITome {
    username: string;
    dateAdded: Date;
}

const tomeSchema: Schema<ITome> = new Schema({
    username: { type: String, required: true },
    dateAdded: { type: Date, required: true, default: Date.now },
});

export default tomeSchema;
