export interface IWynnMessage {
    /**
     * Regex that this type of message should look like.
     */
    pattern: RegExp;
    /**
     * Message type to send to discord.
     * 0 - Chat message,
     * 1 - Info message,
     * 2 - Discord only message,
     */
    messageType: number;
    /**
     * A callback function to format a custom message based on the regex matcher.
     * @param matcher regex matcher from message pattern
     * @returns formatted message
     */
    customMessage?: (matcher: RegExpExecArray) => string;
    /**
     * Custom title text/author
     */
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
