import { usernameToUuid } from "./mojangApiClient.js";
import { insertDashes } from "../utils/uuidUtils.js";

async function getPlayersGuildAsync(username: string) {
    const apiUrl = `https://api.wynncraft.com/v3/player/${insertDashes(await usernameToUuid(username))}`;
    const response = await fetch(apiUrl);
    try {
        const data = await response.json();

        return data.guild ?? null;
    } catch (e) {
        console.log("getPlayerGuildAsyncError:", username, e);
        return null;
    }
}

export default async function checkIfPlayerIsGuildAsync(username: string, wynnGuildId: string) {
    const guild = await getPlayersGuildAsync(username);

    if (guild != null) {
        if (guild.uuid == wynnGuildId) {
            return true;
        }
    }

    return false;
}
