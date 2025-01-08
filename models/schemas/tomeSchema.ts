import { Schema } from "mongoose";
import { BaseModel } from "../baseModel.js";

export interface ITome extends BaseModel {
    username: string;
    dateAdded: Date;
}

const tomeSchema: Schema<ITome> = new Schema(
    {
        username: { type: String, required: true },
        dateAdded: { type: Date, required: true, default: Date.now },
    },
    { collation: { locale: "en", strength: 2 } }
);

export default tomeSchema;
