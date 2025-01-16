import { io } from "../app.js";
import "../config.js";
import { IDiscord2WynnMessage, IWynnMessage } from "../types/messageTypes.js";
import { decodeItem } from "../utils/wynntilsItemEncoding.js";
import { decrementAspects, deleteTome, incrementAspects } from "../utils/rewardUtils.js";
import { getOnlineUsers, isOnline } from "../utils/socketUtils.js";
import { usernameToUuid } from "../net/mojangApiClient.js";
import { checkVersion } from "../utils/versionUtils.js";
import { guildDatabases, guildNames } from "../models/guildDatabaseModel.js";
import UserModel from "../models/userModel.js";
import { getChannelFromWynnGuild } from "../utils/serverUtils.js";

const ENCODED_DATA_PATTERN = /([\u{F0000}-\u{FFFFD}]|[\u{100000}-\u{10FFFF}])+/gu;
const wynnMessagePatterns: IWynnMessage[] = [
    { pattern: /^.*§[38](?<header>[^ ]+?)(§[38])?:§[b8] (?<content>.*)$/, messageType: 0 },
    {
        pattern:
            /^§[e8](?<player1>.*?)§[b8], §[e8](?<player2>.*?)§[b8], §[e8](?<player3>.*?)§[b8], and §[e8](?<player4>.*?)§[b8] finished §[38](?<raid>.*?)§[b8].*$/,
        messageType: 1,
        customMessage: (matcher, guildId) => {
            try {
                const users = [
                    matcher.groups!.player1,
                    matcher.groups!.player2,
                    matcher.groups!.player3,
                    matcher.groups!.player4,
                ];
                const raid = matcher.groups!.raid;
                const timestamp = Date.now();

                guildDatabases[guildId].RaidRepository.create({
                    users: users,
                    raid,
                    timestamp,
                }).then((newRaid) => {
                    // Add users to db and increase aspect counter by 0.5
                    Promise.all(
                        newRaid.users.map((username) => {
                            incrementAspects(username.toString(), guildId);
                        })
                    );
                });
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
        customMessage: (matcher, guildId) => {
            decrementAspects(matcher.groups!.receiver, guildId);
            return matcher.groups!.giver + " has given an aspect to " + matcher.groups!.receiver;
        },
        customHeader: "⚠️ Aspect",
    },
    {
        pattern: /^§.(?<giver>.*?)(§.)? rewarded §.a Guild Tome§. to §.(?<receiver>.*?)(§.)?$/,
        messageType: 1,
        customMessage: (matcher, guildId) => {
            deleteTome(matcher.groups!.receiver, guildId);
            return matcher.groups!.giver + " has given a tome to " + matcher.groups!.receiver;
        },
        customHeader: "⚠️ Tome",
    },
    {
        pattern: /^§.(?<giver>.*?)(§.)? rewarded §.1024 Emeralds§. to §.(?<receiver>.*?)(§.)?$/,
        messageType: 1,
        customMessage: (matcher) => matcher.groups!.giver + " has given a 1024 emeralds to " + matcher.groups!.receiver,
        customHeader: "⚠️ 🤑",
    },
    { pattern: /^(?<content>.*)$/, customHeader: "⚠️ Info", messageType: 1 },
];
const hrMessagePatterns: IWynnMessage[] = [
    {
        pattern:
            /^(?<content>§.(?<username>.+?)§. set §.(?<bonus>.+?)§. to level §.(?<level>.+?)§. on §.(?<territory>.*))$/,
        messageType: 1,
        customHeader: "⚠️ 🤓",
    },
    {
        pattern: /^(?<content>§.(?<username>.+?)§. removed §.(?<changed>.+?)§. from §.(?<territory>.*))$/,
        messageType: 1,
        customHeader: "⚠️ 🤓",
    },

    {
        pattern: /^(?<content>§.(?<username>.+?)§. changed §.\d+ \w+§. on §3(?<territory>.*))$/,
        messageType: 1,
        customHeader: "⚠️ 🤓",
    },
    {
        pattern: /^(?<content>Territory §.(?<territory>.+?)§. is \w+ more resources than it can store!)$/,
        messageType: 1,
        customHeader: "⚠️ 🤓",
    },
    {
        pattern: /^(?<content>Territory §.(?<territory>.+?)§. production has stabilised)$/,
        messageType: 1,
        customHeader: "⚠️ 🤓",
    },
    {
        pattern: /^(?<content>§.(?<username>.+?)§. applied the loadout §(?<loadout>..+?)§. on §.(?<territory>.*))$/,
        messageType: 1,
        customHeader: "⚠️ 🤓",
    },
    {
        pattern: /^(?<content>§.(?<username>.+?)§. \w+ §.(?<deposited>.+?)§. to the Guild Bank \(§.High Ranked§.\))$/,
        messageType: 1,
        customHeader: "⚠️ Info",
    },
    {
        pattern: /^(?<content>§.A Guild Tome§. has been found and added to the Guild Rewards)$/,
        messageType: 1,
        customHeader: "⚠️ Info",
    },
];
const discordOnlyPattern = new RegExp("^(?<header>.+?): (?<content>.*)$");

const messageIndexes: { [key: string]: number } = {};
const hrMessageIndexes: { [key: string]: number } = {};

export function registerMessageIndexes() {
    Object.entries(guildNames).forEach((value) => {
        messageIndexes[value[0]] = 0;
        hrMessageIndexes[value[0]] = 0;
    });
}

let botId = "";

// TODO: make middleware for handling mutes
io.of("/discord").on("connection", (socket) => {
    console.log(socket.data.username, "connected to discord with version:", socket.data.modVersion);
    if (socket.data.wynnGuildId === "*") {
        botId = socket.id;
    } else {
        if (messageIndexes[socket.data.wynnGuildId] == undefined) {
            messageIndexes[socket.data.wynnGuildId] = 0;
            hrMessageIndexes[socket.data.wynnGuildId] = 0;
        }
        socket.data.messageIndex = messageIndexes[socket.data.wynnGuildId];
        socket.data.hrMessageIndex = hrMessageIndexes[socket.data.wynnGuildId];
        socket.join(socket.data.wynnGuildId);
        console.log(socket.data.username, "joined", socket.data.wynnGuildId);
    }

    /**
     * Event that gets fired upon a guild message captured by a mod client
     */
    socket.on("wynnMessage", (message: string) => {
        if (!checkVersion(socket.data.modVersion)) {
            console.log(`skipping request from outdated mod version: ${socket.data.modVersion}`);
            return;
        }
        getChannelFromWynnGuild(socket.data.wynnGuildId).then((channel) => {
            if (channel === "none") {
                console.log("no channel set up for:", socket.data.wynnGuildId);
                return;
            }

            if (socket.data.messageIndex === messageIndexes[socket.data.wynnGuildId]) {
                ++socket.data.messageIndex;
                ++messageIndexes[socket.data.wynnGuildId];
                for (let i = 0; i < wynnMessagePatterns.length; i++) {
                    const pattern = wynnMessagePatterns[i];
                    const matcher = pattern.pattern.exec(message);
                    if (matcher) {
                        const header = pattern.customHeader ? pattern.customHeader : matcher.groups!.header;
                        const rawMessage = pattern.customMessage
                            ? pattern.customMessage(matcher, socket.data.wynnGuildId)
                            : matcher.groups!.content;
                        console.log(
                            header,
                            rawMessage,
                            messageIndexes[socket.data.wynnGuildId],
                            "emitted by:",
                            socket.data.username
                        );

                        const message = rawMessage
                            .replace(new RegExp("§.", "g"), "")
                            .replace(ENCODED_DATA_PATTERN, (match, _) => `**__${decodeItem(match).name}__**`);
                        isOnline(header, socket.data.wynnGuildId).then((online) => {
                            io.of("/discord")
                                .to(botId)
                                .emit("wynnMessage", {
                                    MessageType: pattern.messageType,
                                    HeaderContent: header + (online ? "*" : ""),
                                    TextContent: message,
                                    ListeningChannel: channel,
                                });
                        });
                        break;
                    }
                }
            } else {
                ++socket.data.messageIndex;
            }
        });
    });

    /**
     * Event that gets fired upon an hr message captured by a mod client
     */
    socket.on("hrMessage", (message: string) => {
        if (!checkVersion(socket.data.modVersion)) {
            console.log(`skipping request from outdated mod version: ${socket.data.modVersion}`);
            return;
        }
        getChannelFromWynnGuild(socket.data.wynnGuildId).then((channel) => {
            if (channel === "none") {
                console.log("no channel set up for:", socket.data.wynnGuildId);
                return;
            }

            if (socket.data.hrMessageIndex === hrMessageIndexes[socket.data.wynnGuildId]) {
                ++socket.data.hrMessageIndex;
                ++hrMessageIndexes[socket.data.wynnGuildId];
                for (let i = 0; i < hrMessagePatterns.length; i++) {
                    const pattern = hrMessagePatterns[i];
                    const matcher = pattern.pattern.exec(message);
                    if (matcher) {
                        const header = pattern.customHeader ? pattern.customHeader : matcher.groups!.header;
                        const rawMessage = pattern.customMessage
                            ? pattern.customMessage(matcher, socket.data.wynnGuildId)
                            : matcher.groups!.content;
                        console.log(
                            "hr",
                            header,
                            rawMessage,
                            hrMessageIndexes[socket.data.wynnGuildId],
                            "emitted by:",
                            socket.data.username
                        );
                        const message = rawMessage.replace(new RegExp("§.", "g"), "");
                        io.of("/discord").to(botId).emit("wynnMessage", {
                            MessageType: pattern.messageType,
                            HeaderContent: header,
                            TextContent: message,
                            ListeningChannel: channel,
                        });
                        break;
                    }
                }
            } else {
                ++socket.data.hrMessageIndex;
            }
        });
    });

    /**
     * Event that gets fired upon a discord only message being sent from a mod client
     */
    socket.on("discordOnlyWynnMessage", async (message: string) => {
        const channel = await getChannelFromWynnGuild(socket.data.wynnGuildId);
        if (channel === "none") {
            console.log("no channel set up for:", socket.data.wynnGuildId);
            return;
        }
        const matcher = discordOnlyPattern.exec(message);
        if (matcher) {
            const header = matcher.groups!.header;
            const message = matcher.groups!.content.replace(
                ENCODED_DATA_PATTERN,
                (match, _) => `<${decodeItem(match).name}>`
            );
            const user = await UserModel.findOne(
                { uuid: await usernameToUuid(header) },
                {},
                { collation: { locale: "en", strength: 2 } }
            ).exec();
            if (!user || !user.muted) {
                console.log(message);
                io.of("/discord").to(botId).emit("wynnMessage", {
                    MessageType: 2,
                    HeaderContent: header,
                    TextContent: message,
                    ListeningChannel: channel,
                });
            }
        }
    });

    /**
     * Event that gets fired upon a message that needs to be sent from discord to wynn (including discord only wynn messages)
     */
    socket.on("discordMessage", async (message: IDiscord2WynnMessage) => {
        const user = await UserModel.findOne(
            { uuid: await usernameToUuid(message.Author) },
            {},
            { collation: { locale: "en", strength: 2 } }
        ).exec();

        if (!user || !user.muted) {
            console.log(message);
            io.of("/discord")
                .to(message.WynnGuildId)
                .emit("discordMessage", {
                    ...message,
                    Content: message.Content.replace(/[‌⁤ÁÀ֎]/g, ""),
                });
        } else {
            console.log("muted message:", message);
            io.of("/discord")
                .to(socket.id)
                .emit("discordMessage", { Author: "SYSTEM", Content: "You are muted.", WynnGuildId: "" });
        }
    });

    socket.on("listOnline", async (callback) => {
        callback((await getOnlineUsers(socket.data.wynnGuildId)).map((onlineUser) => onlineUser.Username));
    });

    socket.on("sync", () => {
        socket.data.messageIndex = messageIndexes[socket.data.wynnGuildId];
    });

    socket.on("disconnect", (reason) => {
        console.log(socket.data.username, "disconnected with reason:", reason);
        io.of("/discord")
            .fetchSockets()
            .then((sockets) => {
                sockets.forEach((s) => {
                    s.data.messageIndex = messageIndexes[socket.data.wynnGuildId];
                });
            });
    });
});
