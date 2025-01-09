import { BaseModel } from "../../models/baseModel.js";
import { Model } from "mongoose";
import { DatabaseError } from "../../errors/implementations/databaseError.js";

export type FilterOptions = Record<string, unknown>;

export interface IRepository<T> {
    findOne(options: FilterOptions & { [k in keyof T]?: unknown }): Promise<T | null>;

    find(options: FilterOptions & { [k in keyof T]?: unknown }): Promise<T[]>;

    create(data: Partial<T>): Promise<T>;

    update(options: FilterOptions & { [k in keyof T]?: unknown }, data: Partial<T>): Promise<T>;

    deleteOne(options: FilterOptions & { [k in keyof T]?: unknown }): Promise<T | null>;
}

export abstract class BaseRepository<T extends BaseModel> implements IRepository<T> {
    protected constructor(private model: Model<T>) {}

    async findOne(options: FilterOptions): Promise<T | null> {
        try {
            return await this.model.findOne(options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async find(options: FilterOptions = {}): Promise<T[]> {
        try {
            return await this.model.find(options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async create(data: Partial<T>): Promise<T> {
        try {
            const createdEntity = new this.model(data);
            return await createdEntity.save();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async update(options: FilterOptions, data: Partial<T>): Promise<T> {
        try {
            return await this.model
                .findOneAndUpdate(options, data, {
                    upsert: true,
                    new: true,
                    collation: { locale: "en", strength: 2 },
                })
                .exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async deleteOne(options: FilterOptions): Promise<T | null> {
        try {
            return await this.model.findOneAndDelete(options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }
}
