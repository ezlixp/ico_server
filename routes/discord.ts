import { io } from "../app.js";
import "../config.js";

/**
 * Maps all discord-related endpoints
 */

interface IWynnMessage {
    pattern: RegExp;
    messageType: number;
    customHeader?: string;
}

interface IDiscordMessage {
    Author: string;
    Content: string;
}

const wynnMessagePatterns: IWynnMessage[] = [
    { pattern: new RegExp("^.*§[38](?<header>.+?)(§[38])?:§[b8] (?<content>.*)$"), messageType: 0 },
    { pattern: new RegExp("(?<content>.*)"), customHeader: "[!] Info", messageType: 1 },
];
const discordOnlyPattern = new RegExp("^(?<header>\\[Discord Only\\] .+?): (?<content>.*)$");

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
    socket.on("discordOnlyWynnMessage", (message: string) => {
        const matcher = discordOnlyPattern.exec(message);
        if (matcher) {
            io.of("/discord").emit("wynnMessage", {
                MessageType: 0,
                HeaderContent: matcher.groups!.header,
                TextContent: matcher.groups!.content,
            });
        }
    });
    socket.on("discordMessage", (args: IDiscordMessage) => {
        io.of("/discord").emit("discordMessage", {
            ...args,
            Content: args.Content.replace(
                new RegExp("[^A-Za-z0-9!@#$%^&*()\\[\\]\\{\\}\\\\\\|;:'\",.<>/?`~ ]", "g"),
                ""
            ),
        });
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
