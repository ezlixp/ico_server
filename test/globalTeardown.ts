import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalTeardown() {
    console.log("\x1b[42mTearing down memory server.\x1b[0m");

    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
    await instance.stop();
}
