import { createServer } from "http";
import app from "./app.js";
import validateSocket from "./sockets/security/socketValidator.js";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types/socketIOTypes.js";
import { Server } from "socket.io";

const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

io.on("new_namespace", (namespace) => {
    namespace.use(validateSocket);
});

export { io, server };
