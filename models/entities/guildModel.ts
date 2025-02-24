import mongoose, { Model, Schema } from 'mongoose';
import { BaseModel } from './baseModel.js';

export interface IGuild extends BaseModel {
    validationKey: string;
    wynnGuildId: string;
    wynnGuildName: string;
}

const validationSchema: Schema<IGuild> = new Schema({
    validationKey: { type: String, required: true },
    wynnGuildId: { type: String, required: true },
    wynnGuildName: { type: String, required: true },
});

const GuildModel: Model<IGuild> = mongoose.model(
    'ValidationKey',
    validationSchema,
);

export default GuildModel;
