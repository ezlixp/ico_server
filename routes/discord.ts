import { io } from "../app.js";
import "../config.js";

/**
 * Maps all discord-related endpoints
 */

type wynnMessagePattern = {
    pattern: RegExp;
    messageType: number;
    customHeader?: string;
};
const wynnMessagePatterns: wynnMessagePattern[] = [
    { pattern: new RegExp("^.*§[38](?<header>.+?)(§[38])?:§[b8] (?<content>.*)$"), messageType: 0 },
    {
        pattern: new RegExp("^(?<header>\\[Discord Only\\] .+?): (?<content>.*)$"),
        messageType: 0,
    },
    { pattern: new RegExp("(?<content>.*)"), customHeader: "[!] Info", messageType: 1 },
];

let messageIndex = 0;
io.of("/discord").on("connection", (socket) => {
    console.log(socket.id + " discord");
    socket.data.messageIndex = messageIndex;
    socket.on("wynnMessage", async (message: string) => {
        if (socket.data.messageIndex === messageIndex) {
            ++messageIndex;
            ++socket.data.messageIndex;
            for (let i = 0; i < wynnMessagePatterns.length; i++) {
                const pattern = wynnMessagePatterns[i];
                const matcher = pattern.pattern.exec(message);
                if (matcher) {
                    console.log(matcher.groups!.content);
                    io.of("/discord").emit("wynnMessage", {
                        MessageType: pattern.messageType,
                        HeaderContent: pattern.customHeader || matcher.groups!.header,
                        TextContent: matcher.groups!.content,
                    });
                    break;
                }
            }
        } else {
            ++socket.data.messageIndex;
            if (socket.data.messageIndex < messageIndex - 10) socket.data.messageIndex = messageIndex;
        }
    });
    socket.on("discordMessage", (args) => {
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
