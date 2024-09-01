import mongoose, {Schema} from "mongoose";

const waitlistSchema = new Schema({
    username: {type: String, required: true},
    dateAdded: {type: Date, required: true, default: Date.now()},
});

const WaitlistModel = mongoose.model("Waitlist", waitlistSchema);

export default WaitlistModel;
