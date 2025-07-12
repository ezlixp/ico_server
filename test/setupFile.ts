import { afterAll, beforeAll } from "@jest/globals";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect(process.env["MONGO_URI"]!);
});

afterAll(async () => {
    await mongoose.disconnect();
});
