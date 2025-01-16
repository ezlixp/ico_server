import { Schema } from "mongoose";
import { BaseModel } from "../baseModel.js";

export interface IRaid extends BaseModel {
    users: string[];
    raid: string;
    timestamp: number;
}

export interface IRaidRewardsResponse {
    username: string;
    raids: number;
    aspects: number;
    liquidEmeralds: number;
}

export interface ILeaderboardUser {
    username: string;
    raids: number;
}

const raidSchema: Schema<IRaid> = new Schema({
    users: { type: [String], required: true },
    raid: { type: String, required: true },
    timestamp: { type: Number, required: true },
});

export default raidSchema;
