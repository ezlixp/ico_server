import { io } from "../app.js";
import "../config.js";

/**
 * Maps all discord-related endpoints
 */

type wynnMessageArgs = {
    content: string;
    extractedUsernames: string[];
};

let messageIndex = 0;
io.of("/discord").on("connection", (socket) => {
    console.log(socket.id + " discord");
    socket.data.messageIndex = messageIndex;
    socket.on("wynnMessage", async (args: wynnMessageArgs) => {
        if (socket.data.messageIndex === messageIndex) {
            ++messageIndex;
            ++socket.data.messageIndex;
            console.log(args.content, args.extractedUsernames);
            io.of("/discord").emit("wynnMessage", args.content);
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
