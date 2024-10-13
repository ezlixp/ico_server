import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import validateSocket from "./security/socketValidator.js";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./types/socketIOTypes.js";

const app = express();
const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

io.on("new_namespace", (namespace) => {
    namespace.use(validateSocket);
});

export { io, server };
export default app;
