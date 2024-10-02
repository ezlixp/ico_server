import { io } from "../app.js";
import "../config.js";

/**
 * Maps all discord-related endpoints
 */

type wynnMessageArgs = {
    Username: string;
    TextContent: string;
};
const guildMessagePattern = new RegExp(
    "^(.*§[38])?(?<author>(\\[Discord Only\\] )?.+?)(§[38])?:(§[b8])? (?<content>.*)$"
);

let messageIndex = 0;
io.of("/discord").on("connection", (socket) => {
    console.log(socket.id + " discord");
    socket.data.messageIndex = messageIndex;
    socket.on("wynnMessage", async (message: string) => {
        if (socket.data.messageIndex === messageIndex) {
            ++messageIndex;
            ++socket.data.messageIndex;
            const matcher = message.match(guildMessagePattern);
            console.log(message);
            if (matcher) {
                io.of("/discord").emit("wynnMessage", {
                    MessageType: 0,
                    HeaderContent: matcher.groups!.author,
                    TextContent: matcher.groups!.content,
                });
            } else {
                io.of("/discord").emit("wynnMessage", { MessageType: 1, TextContent: message });
            }
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
