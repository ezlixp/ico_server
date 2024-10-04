import { io } from "../app.js";
import "../config.js";

/**
 * Maps all discord-related endpoints
 */

interface IWynnMessage {
    pattern: RegExp;
    messageType: number;
    customMessage?: (matcher: RegExpExecArray) => string;
    customHeader?: string;
}

interface IDiscordMessage {
    Author: string;
    Content: string;
}

const wynnMessagePatterns: IWynnMessage[] = [
    { pattern: new RegExp("^.*§[38](?<header>.+?)(§[38])?:§[b8] (?<content>.*)$"), messageType: 0 },
    {
        pattern: new RegExp(
            "^§[b8]((󏿼󐀆)|(󏿼󏿿󏿾))§[b8] §[e8](?<player1>.*?)§[b8], §[e8](?<player2>.*?)§[b8], §[e8](?<player3>.*?)§[b8], and §[e8](?<player4>.*?)§[b8] finished §[38](?<raid>.*?)§[b8].*$"
        ),
        messageType: 1,
        customMessage: (matcher) =>
            matcher.groups!.player1 +
            ", " +
            matcher.groups!.player2 +
            ", " +
            matcher.groups!.player3 +
            ", and" +
            matcher.groups!.player4 +
            " completed " +
            matcher.groups!.raid,
        customHeader: "[!] Guild Raida",
    },
    {
        pattern: new RegExp(
            "^§.((󏿼󐀆)|(󏿼󏿿󏿾))§. §.(?<giver>.*?)(§.)? rewarded §.an Aspect§. to §.(?<receiver>.*?)(§.)?$"
        ),
        messageType: 1,
        customMessage: (matcher) => matcher.groups!.giver + " has given an aspect to " + matcher.groups!.receiver,
        customHeader: "[!] Aspect",
    },
    {
        pattern: new RegExp("§.(?<giver>.*?)(§.)? rewarded §.a Guild Tome§. to §.(?<receiver>.*?)(§.)?"),
        messageType: 1,
        customMessage: (matcher) => matcher.groups!.giver + "has given a tome to " + matcher.groups!.receiver,
        customHeader: "[!] Tome",
    },
    {
        pattern: new RegExp("§.(?<giver>.*?)(§.)? rewarded §.1024 Emeralds§. to §.(?<receiver>.*?)(§.)?"),
        messageType: 1,
        customMessage: (matcher) => matcher.groups!.giver + "has given a 1024 emeralds to " + matcher.groups!.receiver,
        customHeader: "[!] :money_mouth:",
    },
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
                        TextContent: pattern.customMessage ? pattern.customMessage(matcher) : matcher.groups!.content,
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
            Content: args.Content.replace(new RegExp("[‌⁤ÁÀ֎]", "g"), ""),
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
