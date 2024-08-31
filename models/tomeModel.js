import mongoose, {Schema} from "mongoose";

const schema = mongoose.Schema;
const tomeSchema = new Schema({
    username: {type: String, required: true},
});

const TomeModel = mongoose.model("Tome", tomeSchema);

export default TomeModel;