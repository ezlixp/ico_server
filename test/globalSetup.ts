import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import console from "console";
import supertest from "supertest";
import { server } from "../src/socket";
import { JwtTokenHandler } from "../src/security/jwtHandler";

export const request = supertest(server);
export const authHeader = JwtTokenHandler.create()
    .generateAdminToken()
    .then((res) => ({
        Authorization: "Bearer " + res.token!,
    }));

export default async function globalSetup() {
    console.log("\n\x1b[42mSetting up memory server.\x1b[0m");

    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;

    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf("/"));

    const conn = await mongoose.connect(`${process.env.MONGO_URI}/main`);
    await conn.connection.db?.dropDatabase();
    await mongoose.disconnect();
}
