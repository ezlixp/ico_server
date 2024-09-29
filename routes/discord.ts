import { TextChannel } from "discord.js";
import { io } from "../app.js";
import client from "../bot.js";
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
    console.log(socket.id);
    socket.data.messageIndex = messageIndex;
    socket.on("send", async (args: sendEventArgs) => {
        if (socket.data.messageIndex === messageIndex) {
            ++messageIndex;
            ++socket.data.messageIndex;
            console.log(args.username, args.message);
            const channel = client.channels.cache.find((ch) => ch.id == process.env.DISCORD_BOT_LOGGING_CHANNEL);
            if (channel?.isTextBased) {
                (<TextChannel>channel).send(`${args.username}: ${args.message}`);
            }
        } else {
            ++socket.data.messageIndex;
            if (socket.data.messageIndex < messageIndex - 10) socket.data.messageIndex = messageIndex;
        }
    });
    socket.on("sync", () => {
        socket.data.messageIndex = messageIndex;
    });
    socket.on("debug_index", () => {
        console.log(socket.data.messageIndex);
    });
});
