import "../config";
import { IB2SDiscord2WynnMessage, IWynnMessage } from "../types/messageTypes";
import { decodeItem } from "../utils/wynntilsItemEncoding";
import { getOnlineUsers, isOnline } from "../utils/socketUtils";
import { checkVersion } from "../utils/versionUtils";
import { guildDatabases, guildNames } from "../models/entities/guildDatabaseModel";
import { getChannelFromWynnGuild } from "../utils/serverUtils";
import { io } from "../socket";
import Services from "../services/services";
import { usernameToUuid, uuidToUsername } from "../communication/httpClients/mojangApiClient";

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

                guildDatabases[guildId].RaidRepository.create({
                    users: users,
                    raid,
                }).then((newRaid) => {
                    // Add users to db and increase aspect counter by 0.5
                    Promise.all(
                        newRaid.users.map(async (username) => {
                            await Services.raid.updateRewards(await usernameToUuid(username), guildId, 0.5);
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
            Services.raid.updateRewards(matcher.groups!.receiver, guildId, -1);
            return matcher.groups!.giver + " has given an aspect to " + matcher.groups!.receiver;
        },
        customHeader: "⚠️ Aspect",
    },
    {
        pattern: /^§.(?<giver>.*?)(§.)? rewarded §.a Guild Tome§. to §.(?<receiver>.*?)(§.)?$/,
        messageType: 1,
        customMessage: (matcher, guildId) => {
            Services.tome.deleteFromTomeList(matcher.groups!.receiver, guildId);
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

const disconnectTimers: { [key: string]: NodeJS.Timeout | null } = {};

export function registerMessageIndexes() {
    Object.entries(guildNames).forEach((value) => {
        messageIndexes[value[0]] = 0;
        hrMessageIndexes[value[0]] = 0;
    });
}

let botId = "";
const errorHandler = (toHandle: Function) => {
    const handleError = (error: Error) => {
        console.error("socket error:", error);
    };
    return (...args: unknown[]) => {
        try {
            const ret = toHandle.apply(this, args);
            if (ret && typeof ret.catch === "function") {
                ret.catch(handleError);
            }
        } catch (e: any) {
            handleError(e);
        }
    };
};

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
        if (disconnectTimers[socket.data.discordUuid] != null) {
            clearTimeout(disconnectTimers[socket.data.discordUuid]!);
            disconnectTimers[socket.data.discordUuid] = null;
        } else {
            getChannelFromWynnGuild(socket.data.wynnGuildId).then((channel) => {
                io.of("/discord")
                    .to(botId)
                    .emit("wynnMessage", {
                        MessageType: 1,
                        HeaderContent: ["⚠️ Info"],
                        TextContent: socket.data.username + " logged in!",
                        ListeningChannel: channel,
                    });
            });
        }
        socket.join(socket.data.wynnGuildId);
        console.log(socket.data.username, "joined", socket.data.wynnGuildId);
    }

    socket.use((packet, next) => {
        if (socket.data.muted) {
            return next(new Error("You are muted."));
        }
        next();
    });

    socket.on("error", (err) => {
        socket.emit("error", err.message);
    });

    /**
     * Event that gets fired upon a guild message captured by a mod client
     */
    socket.on(
        "wynnMessage",
        errorHandler((message: string) => {
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
                    io.of("/discord").to(socket.data.wynnGuildId).emit("wynnMirror", message);
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
                                socket.data.username,
                                "discord:",
                                socket.data.discordUuid,
                                "guild:",
                                socket.data.wynnGuildId
                            );

                            let discordUuid: string | undefined;
                            usernameToUuid(header)
                                .then(async (uuid) => {
                                    try {
                                        const user = await Services.user.getUserByMcUuid(uuid);
                                        discordUuid = user?.discordUuid;
                                    } catch {}
                                })
                                .catch(() => {})
                                .finally(() => {
                                    const message = rawMessage
                                        .replace(new RegExp("§.", "g"), "")
                                        .replace(
                                            ENCODED_DATA_PATTERN,
                                            (match, _) => `**__${decodeItem(match).name}__**`
                                        );
                                    isOnline(header, socket.data.wynnGuildId).then((online) => {
                                        io.of("/discord")
                                            .to(botId)
                                            .emit("wynnMessage", {
                                                MessageType: pattern.messageType,
                                                HeaderContent: [header + (online ? "*" : ""), discordUuid],
                                                TextContent: message,
                                                ListeningChannel: channel,
                                            });
                                    });
                                });
                            break;
                        }
                    }
                } else {
                    ++socket.data.messageIndex;
                }
            });
        })
    );

    /**
     * Event that gets fired upon an hr message captured by a mod client
     */
    socket.on(
        "hrMessage",
        errorHandler((message: string) => {
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
                                socket.data.username,
                                "discord:",
                                socket.data.discordUuid,
                                "guild:",
                                socket.data.wynnGuildId
                            );
                            const message = rawMessage.replace(new RegExp("§.", "g"), "");
                            io.of("/discord")
                                .to(botId)
                                .emit("wynnMessage", {
                                    MessageType: pattern.messageType,
                                    HeaderContent: [header],
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
        })
    );

    /**
     * Event that gets fired upon a discord only message being sent from a mod client
     */
    socket.on(
        "discordOnlyWynnMessage",
        errorHandler(async (message: string) => {
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
                console.log(message);
                io.of("/discord")
                    .to(botId)
                    .emit("wynnMessage", {
                        MessageType: 2,
                        HeaderContent: [header, socket.data.discordUuid],
                        TextContent: message,
                        ListeningChannel: channel,
                    });
                io.of("/discord")
                    .to(socket.data.wynnGuildId)
                    .emit("discordMessage", {
                        DiscordUsername: "@none",
                        McUsername: header as string,
                        Content: message.replace(/[‌⁤ÁÀ֎]/g, "") as string,
                        WynnGuildId: socket.data.wynnGuildId,
                    });
            }
        })
    );

    /**
     * Event that gets fired upon a message that needs to be sent from discord to wynn (including discord only wynn messages)
     */
    socket.on(
        "discordMessage",
        errorHandler(async (message: IB2SDiscord2WynnMessage) => {
            console.log(message);
            const mcUuid = (await Services.user.getUserByDiscord(message.DiscordUuid))?.mcUuid;
            const mcUsername = mcUuid ? await uuidToUsername(mcUuid) : undefined;
            io.of("/discord")
                .to(message.WynnGuildId)
                .emit("discordMessage", {
                    ...message,
                    McUsername: mcUsername,
                    Content: message.Content.replace(/[‌⁤ÁÀ֎]/g, ""),
                });
        })
    );

    socket.on(
        "listOnline",
        errorHandler(async (callback: Function) => {
            callback((await getOnlineUsers(socket.data.wynnGuildId)).map((onlineUser) => onlineUser.McUsername));
        })
    );

    socket.on("sync", (ack) => {
        socket.data.messageIndex = messageIndexes[socket.data.wynnGuildId];
        ack();
    });

    socket.on(
        "disconnect",
        errorHandler((reason: string) => {
            console.log(socket.data.username, "disconnected with reason:", reason);
            io.of("/discord")
                .fetchSockets()
                .then((sockets) => {
                    sockets.forEach((s) => {
                        if (s.data.wynnGuildId === socket.data.wynnGuildId)
                            s.data.messageIndex = messageIndexes[socket.data.wynnGuildId];
                    });
                });
            if (socket.data.discordUuid !== "!bot") {
                disconnectTimers[socket.data.discordUuid] = setTimeout(() => {
                    getChannelFromWynnGuild(socket.data.wynnGuildId).then((channel) => {
                        getChannelFromWynnGuild(socket.data.wynnGuildId).then((channel) => {
                            io.of("/discord")
                                .to(botId)
                                .emit("wynnMessage", {
                                    MessageType: 1,
                                    HeaderContent: ["⚠️ Info"],
                                    TextContent: socket.data.username + " logged out.",
                                    ListeningChannel: channel,
                                });
                        });
                    });
                    disconnectTimers[socket.data.discordUuid] = null;
                }, 10000);
            }
        })
    );
});

