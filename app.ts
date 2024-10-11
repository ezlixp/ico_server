import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import validateSocket from "./security/socketValidator.js";
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
    },
});
io.on("new_namespace", (namespace) => {
    namespace.use(validateSocket);
});
export { io, server };
export default app;
