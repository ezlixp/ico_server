import { io } from "../app.js";
import "../config.js";
import RaidModel from "../models/raidModel.js";
import UserModel from "../models/userModel.js";
import checkVersion from "../services/checkModVersion.js";
import { IDiscordMessage, IWynnMessage } from "../types/messageTypes.js";
import { decodeItem } from "../services/wynntilsItemEncoding.js";

/**
 * Maps all discord-related endpoints
 */

const ENCODED_DATA_PATTERN = /([\u{F0000}-\u{FFFFD}]|[\u{100000}-\u{10FFFF}])+/gu;
const hrMessagePatterns: IWynnMessage[] = [
    {
        pattern: /^§.(?<setter>.+?)§. set §.(?<bonus>.+?)§. to level §.(?<level>.+?)§. on §.(?<territory>.*)$/,
        messageType: 1,
        customHeader: "⚠️🤓",
    },
    {
        pattern: /^Territory §.(?<territory>.+?)§. is \w+ more resources than it can store!$/,
        messageType: 1,
        customHeader: "⚠️🤓",
    },
    {
        pattern: /^Territory §.(?<territory>.+?)§. production has stabilised$/,
        messageType: 1,
        customHeader: "⚠️🤓",
    },
];
const wynnMessagePatterns: IWynnMessage[] = [
    { pattern: /^.*§[38](?<header>.+?)(§[38])?:§[b8] (?<content>.*)$/, messageType: 0 },
    {
        pattern:
            /^§[e8](?<player1>.*?)§[b8], §[e8](?<player2>.*?)§[b8], §[e8](?<player3>.*?)§[b8], and §[e8](?<player4>.*?)§[b8] finished §[38](?<raid>.*?)§[b8].*$/,
        messageType: 1,
        customMessage: (matcher) => {
            try {
                const users = [
                    matcher.groups!.player1,
                    matcher.groups!.player2,
                    matcher.groups!.player3,
                    matcher.groups!.player4,
                ];
                const raid = matcher.groups!.raid;
                const timestamp = Date.now();

                const sortedUsers = users.sort((user1, user2) =>
                    user1.localeCompare(user2, "en", { sensitivity: "base" })
                );

                const newRaid = new RaidModel({
                    users: sortedUsers,
                    raid,
                    timestamp,
                });

                newRaid.save();

                // Add users to db and increase aspect counter by 0.5
                Promise.all(
                    newRaid.users.map((username) => {
                        UserModel.updateOne(
                            { username: username },
                            { $inc: { aspects: 0.5 } },
                            { upsert: true, collation: { locale: "en", strength: 2 } }
                        ).then(() => console.log(username, "got 0.5 aspects"));
                    })
                );
            } catch (error) {
                console.error("postRaidError:", error);
            }
            return (
                matcher.groups!.player1 +
                ", " +
                matcher.groups!.player2 +
                ", " +
                matcher.groups!.player3 +
                ", and " +
                matcher.groups!.player4 +
                " completed " +
                matcher.groups!.raid
            );
        },
        customHeader: "⚠️ Guild Raida",
    },
    {
        pattern: /^§.(?<giver>.*?)(§.)? rewarded §.an Aspect§. to §.(?<receiver>.*?)(§.)?$/,
        messageType: 1,
        customMessage: (matcher) => {
            UserModel.updateOne(
                { username: matcher.groups!.receiver },
                { $inc: { aspects: -1 } },
                {
                    upsert: true,
                    collation: { locale: "en", strength: 2 },
                }
            ).then(() => {
                console.log(matcher.groups!.receiver, "received an aspect");
            });
            return matcher.groups!.giver + " has given an aspect to " + matcher.groups!.receiver;
        },
        customHeader: "⚠ Aspect",
    },
    {
        pattern: /^§.(?<giver>.*?)(§.)? rewarded §.a Guild Tome§. to §.(?<receiver>.*?)(§.)?$/,
        messageType: 1,
        customMessage: (matcher) => matcher.groups!.giver + " has given a tome to " + matcher.groups!.receiver,
        customHeader: "⚠️ Tome",
    },
    {
        pattern: /^§.(?<giver>.*?)(§.)? rewarded §.1024 Emeralds§. to §.(?<receiver>.*?)(§.)?$/,
        messageType: 1,
        customMessage: (matcher) => matcher.groups!.giver + " has given a 1024 emeralds to " + matcher.groups!.receiver,
        customHeader: "⚠️ 🤑",
    },
    { pattern: /(?<content>.*)/, customHeader: "⚠ Info", messageType: 1 },
];
const discordOnlyPattern = new RegExp("^\\[Discord Only\\] (?<header>.+?): (?<content>.*)$"); // remove discord only at some point, need to remove it from mod too

let messageIndex = 0;
let hrMessageIndex = 0;
io.of("/discord").on("connection", (socket) => {
    console.log(socket.data.username, "connected to discord with version:", socket.data.modVersion);
    socket.data.messageIndex = messageIndex;
    socket.data.hrMessageIndex = hrMessageIndex;

    socket.on("wynnMessage", (message: string) => {
        if (!checkVersion(socket.data.modVersion)) {
            console.log(`skipping request from outdated mod version: ${socket.data.modVersion}`);
            return;
        }
        let isHrMessage = false;
        for (let i = 0; i < hrMessagePatterns.length; i++) {
            const pattern = hrMessagePatterns[i];
            const matcher = pattern.pattern.exec(message);
            if (matcher) {
                isHrMessage = true;
                break;
            }
        }
        if (isHrMessage) {
            if (socket.data.hrMessageIndex === hrMessageIndex) {
                ++socket.data.hrMessageIndex;
                ++hrMessageIndex;
                for (let i = 0; i < hrMessagePatterns.length; i++) {
                    const pattern = hrMessagePatterns[i];
                    const matcher = pattern.pattern.exec(message);
                    if (matcher) {
                        const header = pattern.customHeader ? pattern.customHeader : matcher.groups!.header;
                        const rawMessage = pattern.customMessage
                            ? pattern.customMessage(matcher)
                            : matcher.groups!.content;
                        console.log("hr", header, rawMessage, messageIndex);
                        const message = rawMessage.replace(new RegExp("§.", "g"), "");
                        io.of("/discord").emit("wynnMessage", {
                            MessageType: pattern.messageType,
                            HeaderContent: header,
                            TextContent: message,
                        });
                        break;
                    }
                }
            } else {
                ++socket.data.hrMessageIndex;
            }
        } else {
            if (socket.data.messageIndex === messageIndex) {
                ++socket.data.messageIndex;
                ++messageIndex;
                for (let i = 0; i < wynnMessagePatterns.length; i++) {
                    const pattern = wynnMessagePatterns[i];
                    const matcher = pattern.pattern.exec(message);
                    if (matcher) {
                        const header = pattern.customHeader ? pattern.customHeader : matcher.groups!.header;
                        const rawMessage = pattern.customMessage
                            ? pattern.customMessage(matcher)
                            : matcher.groups!.content;
                        console.log(header, rawMessage, messageIndex);
                        const message = rawMessage
                            .replace(new RegExp("§.", "g"), "")
                            .replace(ENCODED_DATA_PATTERN, (match, _) => `**__${decodeItem(match).name}__**`);
                        io.of("/discord").emit("wynnMessage", {
                            MessageType: pattern.messageType,
                            HeaderContent: header,
                            TextContent: message,
                        });
                        break;
                    }
                }
            } else {
                ++socket.data.messageIndex;
            }
        }
    });
    socket.on("discordOnlyWynnMessage", (message: string) => {
        const matcher = discordOnlyPattern.exec(message);
        if (matcher) {
            io.of("/discord").emit("wynnMessage", {
                MessageType: 2,
                HeaderContent: matcher.groups!.header,
                TextContent: matcher.groups!.content.replace(
                    ENCODED_DATA_PATTERN,
                    (match, _) => `<${decodeItem(match).name}>`
                ),
            });
        }
    });
    socket.on("discordMessage", (message: IDiscordMessage) => {
        io.of("/discord").emit("discordMessage", {
            ...message,
            Content: message.Content.replace(new RegExp("[‌⁤ÁÀ֎]", "g"), ""),
        });
    });
    socket.on("listOnline", async (callback) => {
        const out: string[] = [];
        const sockets = await io.of("/discord").fetchSockets();
        sockets.forEach((socket) => {
            if (socket.data.username) out.push(socket.data.username);
        });
        callback(out);
    });
    socket.on("sync", () => {
        socket.data.messageIndex = messageIndex;
    });
    socket.on("disconnect", (reason) => {
        console.log(socket.data.username, "disconnected with reason:", reason);
        io.of("/discord")
            .fetchSockets()
            .then((sockets) => {
                sockets.forEach((s) => {
                    s.data.messageIndex = messageIndex;
                });
            });
    });
});
