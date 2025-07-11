import { connect } from "mongoose";
import "./config";
import "./sockets/discord";
import { registerMessageIndexes } from "./sockets/discord";
import { GuildDatabaseCreator } from "./services/guild/guildDatabaseCreator";
import { server } from "./socket";

// Connect to database
try {
    const dbUrl = process.env.DB_URL;
    connect(dbUrl, { retryWrites: true, writeConcern: { w: "majority" } }).then(() => {
        const databaseCreator = new GuildDatabaseCreator();
        databaseCreator.registerDatabases().then(() => {
            registerMessageIndexes();
            const PORT = process.env.PORT || 3000;

            server.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        });
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
}
