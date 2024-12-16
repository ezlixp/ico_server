import { IDiscordMessage, IWynn2DiscordMessage } from "./messageTypes.js";

export interface ServerToClientEvents {
    wynnMessage: (message: IWynn2DiscordMessage) => void;
    discordMessage: (message: IDiscordMessage) => void;
}

export interface ClientToServerEvents {
    wynnMessage: (message: string) => void;
    hrMessage: (MessageChannel: string) => void;
    discordOnlyWynnMessage: (message: string) => void;
    discordMessage: (message: IDiscordMessage) => void;
    listOnline: (callback: (users: string[]) => void) => void;
    sync: () => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    messageIndex: number;
    hrMessageIndex: number;
    username?: string;
    modVersion?: string;
}
