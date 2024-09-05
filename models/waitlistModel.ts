import mongoose, { Model, Schema } from "mongoose";

interface IWaitlist extends Document {
    username: String;
    dateAdded: Date;
}

const waitlistSchema: Schema<IWaitlist> = new Schema({
    username: { type: String, required: true },
    dateAdded: { type: Date, required: true, default: Date.now() },
});

const WaitlistModel: Model<IWaitlist> = mongoose.model(
    "Waitlist",
    waitlistSchema
);

export default WaitlistModel;
