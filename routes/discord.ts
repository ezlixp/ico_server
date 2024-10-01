import { io } from "../app.js";
import "../config.js";

/**
 * Maps all discord-related endpoints
 */

type sendEventArgs = {
    username: string;
    message: string;
};

let messageIndex = 0;
io.of("/discord").on("connection", (socket) => {
    console.log(socket.id + " discord");
    socket.data.messageIndex = messageIndex;
    socket.on("wynnMessage", async (args: sendEventArgs) => {
        if (socket.data.messageIndex === messageIndex) {
            ++messageIndex;
            ++socket.data.messageIndex;
            console.log(args.username, args.message);
            io.of("/discord").emit("wynnMessage", args.username + ": " + args.message);
        } else {
            ++socket.data.messageIndex;
            if (socket.data.messageIndex < messageIndex - 10) socket.data.messageIndex = messageIndex;
        }
    });
    socket.on("discordMessage", (args) => {
        console.log(args);
        io.of("/discord").emit("discordMessage", args);
    });
    socket.on("sync", () => {
        socket.data.messageIndex = messageIndex;
    });
    socket.on("debug_index", () => {
        console.log(socket.data.messageIndex);
    });
    socket.on("test", (message) => {
        console.log(message);
    });
});
