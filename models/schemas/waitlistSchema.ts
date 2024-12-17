import { Schema } from "mongoose";

export interface IWaitlist extends Document {
    username: String;
    dateAdded: Date;
}

const waitlistSchema: Schema<IWaitlist> = new Schema({
    username: { type: String, required: true },
    dateAdded: { type: Date, required: true, default: Date.now },
});

export default waitlistSchema;
