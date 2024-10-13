export interface IWynnMessage {
    pattern: RegExp;
    // 0 is normal in game message, 1 is info message, 2 is discord only message
    messageType: number;
    customMessage?: (matcher: RegExpExecArray) => string;
    customHeader?: string;
}

export interface IDiscordMessage {
    Author: string;
    Content: string;
}

export interface IWynn2DiscordMessage {
    MessageType: number;
    HeaderContent?: string;
    TextContent: string;
}
