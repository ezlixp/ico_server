/** Caches username to UUID conversions from Mojang api.*/
const UsernameUUIDMap: { [key: string]: { uuid: string; timestamp: number } } = {};

/** Caches UUID to username conversions from Mojang api.*/
const UUIDUsernameMap: { [key: string]: { username: string; timestamp: number } } = {};

export async function UsernametoUUID(username: string): Promise<string> {
    if (UsernameUUIDMap[username] && Date.now() - UsernameUUIDMap[username].timestamp < 1.728e9) {
        return UsernameUUIDMap[username].uuid;
    }
    const url = `https://api.mojang.com/users/profiles/minecraft/${username}`;
    try {
        const response = await fetch(url);
        const res: { id: string } = await response.json();
        if (res.id) {
            UUIDUsernameMap[res.id] = { username: username, timestamp: Date.now() };
            UsernameUUIDMap[username] = { uuid: res.id, timestamp: Date.now() };
            return res.id;
        }
    } catch (error) {
        console.log("username to uuid error:", error);
    }
    return "";
}

export async function UUIDtoUsername(uuid: string): Promise<string> {
    uuid = uuid.replaceAll("-", "");
    if (UUIDUsernameMap[uuid] && Date.now() - UUIDUsernameMap[uuid].timestamp < 1.728e9) {
        return UUIDUsernameMap[uuid].username;
    }
    const url = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`;
    try {
        const response = await fetch(url);
        const res: { name: string } = await response.json();
        if (res.name) {
            UUIDUsernameMap[uuid] = { username: res.name, timestamp: Date.now() };
            UsernameUUIDMap[res.name] = { uuid: uuid, timestamp: Date.now() };
            return res.name;
        }
    } catch (error) {
        console.log("uuid to username error:", error);
    }
    return "";
}
