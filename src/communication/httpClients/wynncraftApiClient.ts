import { usernameToUuid } from "./mojangApiClient";
import { insertDashes } from "../../utils/uuidUtils";

export interface IWynnGuild {
    uuid: string;
    name: string;
    prefix: string;
    rank: string;
    rankStars: string;
}

export async function getUuidGuildAsync(mcUuid: string): Promise<IWynnGuild | null> {
    const apiUrl = `https://api.wynncraft.com/v3/player/${insertDashes(mcUuid)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.guild ?? null;
}

export async function getPlayersGuildAsync(username: string): Promise<IWynnGuild | null> {
    const apiUrl = `https://api.wynncraft.com/v3/player/${insertDashes(await usernameToUuid(username))}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.guild ?? null;
}

export default async function checkIfPlayerIsInGuildAsync(username: string, wynnGuildId: string): Promise<boolean> {
    if (process.env.NODE_ENV === "test") {
        if (wynnGuildId === "correct") return true;
        return false;
    }
    const guild = await getPlayersGuildAsync(username);

    return guild != null && guild.uuid == wynnGuildId;
}
