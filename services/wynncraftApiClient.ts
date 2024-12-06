import { UsernametoUUID } from "./mojangApiClient.js";

async function getPlayersGuildAsync(username: string) {
    const apiUrl = `https://api.wynncraft.com/v3/player/${UsernametoUUID(username)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.guild ?? null;
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
