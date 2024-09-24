import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import validateJwtToken from "./security/jwtTokenValidator.js";
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
    },
});
export { io, server };
export default app;
