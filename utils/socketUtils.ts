import { io } from "../app.js";

interface IOnlineUser {
    Id: number;
    Username: string;
}
export async function getOnlineUsers(): Promise<IOnlineUser[]> {
    const out: IOnlineUser[] = [];
    const sockets = await io.of("/discord").fetchSockets();
    sockets.forEach((socket) => {
        if (socket.data.username) out.push({ Id: out.length, Username: socket.data.username });
    });
    return out;
}

export async function isOnline(username: string): Promise<boolean> {
    const users = await getOnlineUsers();
    return users.some((user) => user.Username === username);
}
