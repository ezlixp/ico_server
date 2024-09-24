import { io } from "../app.js";

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
