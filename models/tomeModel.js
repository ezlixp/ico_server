import mongoose, {Schema} from "mongoose";

const tomeSchema = new Schema({
    username: {type: String, required: true},
    dateAdded: {type: Date, required: true, default: Date.now()},
});

const TomeModel = mongoose.model("Tome", tomeSchema);

export default TomeModel;
