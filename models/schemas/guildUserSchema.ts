import { Schema } from "mongoose";

export interface IGuildUser extends Document {
    uuid: String;
    aspects: Number;
    emeralds: Number;
    raids: Number;
}

// TODO: figure out how to make collation default without having to add it to each request
const guildUserSchema: Schema<IGuildUser> = new Schema({
    uuid: { type: String, required: true },
    aspects: { type: Number, required: true, default: 0 },
    emeralds: { type: Number, required: true, default: 0 },
    raids: { type: Number, required: true, default: 0 },
});

export default guildUserSchema;
