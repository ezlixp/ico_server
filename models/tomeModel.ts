import mongoose, { Model, Schema } from "mongoose";

interface ITome extends Document {
    username: String;
    dateAdded: Date;
}

const tomeSchema: Schema<ITome> = new Schema({
    username: { type: String, required: true },
    dateAdded: { type: Date, required: true, default: Date.now() },
});

const TomeModel: Model<ITome> = mongoose.model("Tome", tomeSchema);

export default TomeModel;
