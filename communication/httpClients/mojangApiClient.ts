import { NotFoundError } from "../../errors/implementations/notFoundError.js";

/** Caches username to UUID conversions from Mojang api.*/
const usernameUuidMap: { [key: string]: { uuid: string; timestamp: number } } = {};

/** Caches UUID to username conversions from Mojang api.*/
const uuidUsernameMap: { [key: string]: { username: string; timestamp: number } } = {};

export async function usernameToUuid(username: string): Promise<string> {
    if (usernameUuidMap[username] && Date.now() - usernameUuidMap[username].timestamp < 1.728e9) {
        return usernameUuidMap[username].uuid;
    }
    const url = `https://api.mojang.com/users/profiles/minecraft/${username}`;
    try {
        const response = await fetch(url);
        if (!response.body) throw "empty mojang username to uuid response";
        const res: { id: string } = await response.json();
        if (res.id) {
            uuidUsernameMap[res.id] = { username: username, timestamp: Date.now() };
            usernameUuidMap[username] = { uuid: res.id, timestamp: Date.now() };
            return res.id;
        }
    } catch (error) {
        console.error("username to uuid error:", error);
    }
    throw new NotFoundError("Could not find minecraft account with provided username.");
}

export async function uuidToUsername(uuid: string): Promise<string> {
    uuid = uuid.replaceAll("-", "");
    if (uuidUsernameMap[uuid] && Date.now() - uuidUsernameMap[uuid].timestamp < 1.728e9) {
        return uuidUsernameMap[uuid].username;
    }
    const url = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`;
    try {
        const response = await fetch(url);
        if (!response.body) throw "empty mojang uuid to username response";
        const res: { name: string } = await response.json();
        if (res.name) {
            uuidUsernameMap[uuid] = { username: res.name, timestamp: Date.now() };
            usernameUuidMap[res.name] = { uuid: uuid, timestamp: Date.now() };
            return res.name;
        }
    } catch (error) {
        console.error("uuid to username error:", error);
    }
    throw new NotFoundError("Could not find minecraft account with provided uuid.");
}
