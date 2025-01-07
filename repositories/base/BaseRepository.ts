import {BaseModel} from "../../models/BaseModel.js";
import {Model} from "mongoose";
import {DatabaseError} from "../../errors/DatabaseError.js";

export type FilterOptions = Record<string, unknown>;

export interface IRepository<T> {
    findOne(options: FilterOptions): Promise<T | null>;

    find(options: FilterOptions): Promise<T[]>;

    create(data: Partial<T>): Promise<void>;

    update(options: FilterOptions, data: Partial<T>): Promise<void>

    deleteOne(options: FilterOptions): Promise<void>;
}

export abstract class BaseRepository<T extends BaseModel> implements IRepository<T> {
    protected constructor(private model: Model<T>) {
    }

    async findOne(options: FilterOptions): Promise<T | null> {
        try {
            return await this.model.findOne(options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async find(options: FilterOptions): Promise<T[]> {
        try {
            return await this.model.find(options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async create(data: Partial<T>): Promise<void> {
        try {
            const createdEntity = new this.model(data);
            await createdEntity.save();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async update(options: FilterOptions, data: Partial<T>): Promise<void> {
        try {
            await this.model.findOneAndUpdate(options, data, {new: true}).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async deleteOne(options: FilterOptions): Promise<void> {
        try {
            await this.model.findOneAndDelete(options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

}