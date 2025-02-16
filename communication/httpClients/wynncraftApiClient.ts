import {usernameToUuid} from "./mojangApiClient.js";
import {insertDashes} from "../../utils/uuidUtils.js";

async function getPlayersGuildAsync(username: string) {
    const apiUrl = `https://api.wynncraft.com/v3/player/${insertDashes(await usernameToUuid(username))}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.guild ?? null;
}

export default async function checkIfPlayerIsInGuildAsync(username: string, wynnGuildId: string): Promise<boolean> {
    const guild = await getPlayersGuildAsync(username);

    return guild != null && guild.uuid == wynnGuildId;
}
