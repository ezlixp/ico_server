import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import { server } from "../src/socket";

export default async function globalSetup() {
    server;
    console.log("\n\x1b[42mSetting up memory server.\x1b[0m");

    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;

    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf("/"));

    const conn = await mongoose.connect(`${process.env.MONGO_URI}/main`);
    await conn.connection.db?.dropDatabase();
    await mongoose.disconnect();
}
