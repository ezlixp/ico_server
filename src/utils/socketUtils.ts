import { io } from "../socket.js";

export interface IOnlineUser {
    Id: number;
    Username: string;
}
export async function getOnlineUsers(guildId: string): Promise<IOnlineUser[]> {
    const out: IOnlineUser[] = [];
    const sockets = await io.of("/discord").in(guildId).fetchSockets();
    sockets.forEach((socket) => {
        if (socket.data.username) out.push({ Id: out.length, Username: socket.data.username });
    });
    return out;
}

export async function isOnline(username: string, guildId: string): Promise<boolean> {
    const users = await getOnlineUsers(guildId);
    return users.some((user) => user.Username === username);
}
