import { guildDatabaseCreator } from "../../globalSetup";

describe("Tome list routes", () => {
    beforeEach(async () => {
        console.log("ran");
        await guildDatabaseCreator.dropDatabases();
        await guildDatabaseCreator.registerDatabases();
    });

    describe("test", () => {
        it("should run once", () => {});
        it("should run twice", () => {});
    });
});

