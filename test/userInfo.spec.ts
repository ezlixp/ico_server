import { describe, it } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app.js";
import supertest from "supertest";

let mongoServer: MongoMemoryServer;
before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("GET /api/v3/blocked/:mcUuid", () => {
    it("should return all blocked users", async () => {
        const res = await supertest(app).get("/api/v3/blocked/pixlze");
    });
});
