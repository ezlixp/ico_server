import { createServer } from "http";
import app from "./app";
import validateSocket from "./sockets/security/socketValidator";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types/socketIOTypes";
import { Server } from "socket.io";

const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

io.on("new_namespace", (namespace) => {
    namespace.use(validateSocket);
});

export { io, server };
