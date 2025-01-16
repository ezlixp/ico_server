import { Schema } from "mongoose";
import { BaseModel } from "../baseModel.js";

export interface IWaitlist extends BaseModel {
    username: string;
    dateAdded: Date;
}

const waitlistSchema: Schema<IWaitlist> = new Schema(
    {
        username: { type: String, required: true },
        dateAdded: { type: Date, required: true, default: Date.now },
    },
    { collation: { locale: "en", strength: 2 } }
);

export default waitlistSchema;
