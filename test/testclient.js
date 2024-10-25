import { io } from "socket.io-client";

const socket = io("http://localhost:3000/discord");
socket.on("connect_error", (err) => {
    console.log(err.message);
    socket.connect();
});
