import { BaseModel } from "../../models/entities/baseModel.js";
import { FilterQuery, HydratedDocument, Model, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";
import { DatabaseError } from "../../errors/implementations/databaseError.js";

export interface IRepository<T> {
    findOne(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ): Promise<HydratedDocument<T> | null>;

    find(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ): Promise<HydratedDocument<T>[]>;

    create(data: Partial<T>): Promise<HydratedDocument<T>>;

    update(options: FilterQuery<T>, data: UpdateQuery<T>): Promise<HydratedDocument<T>>;

    deleteOne(options: FilterQuery<T>): Promise<HydratedDocument<T> | null>;
}

export abstract class BaseRepository<T extends BaseModel> implements IRepository<T> {
    protected constructor(private model: Model<T>) {}

    async findOne(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ): Promise<HydratedDocument<T> | null> {
        try {
            return await this.model.findOne(filter, projection, options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async find(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ): Promise<HydratedDocument<T>[]> {
        try {
            return await this.model.find(filter, projection, options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async create(data: Partial<T>): Promise<HydratedDocument<T>> {
        try {
            const createdEntity = new this.model(data);
            return await createdEntity.save();
        } catch (err) {
            throw new DatabaseError();
        }
    }

    async update(options: FilterQuery<T>, data: UpdateQuery<T>): Promise<HydratedDocument<T>> {
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

    async deleteOne(options: FilterQuery<T>): Promise<HydratedDocument<T> | null> {
        try {
            return await this.model.findOneAndDelete(options).exec();
        } catch (err) {
            throw new DatabaseError();
        }
    }
}
