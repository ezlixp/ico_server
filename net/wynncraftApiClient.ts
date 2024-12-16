import { UsernametoUuid } from "./mojangApiClient.js";
import { InsertDashes } from "../utils/uuidUtils.js";

async function getPlayersGuildAsync(username: string) {
    const apiUrl = `https://api.wynncraft.com/v3/player/${InsertDashes(await UsernametoUuid(username))}`;
    const response = await fetch(apiUrl);
    try {
        const data = await response.json();

        return data.guild ?? null;
    } catch (e) {
        console.log("getPlayerGuildAsyncError:", username, e);
        return null;
    }
}

export default async function checkIfPlayerIsGuildAsync(username: string, guildId: string) {
    const guild = await getPlayersGuildAsync(username);

    if (guild != null) {
        if (guild.uuid == guildId) {
            return true;
        }
    }

    return false;
}
