import mongoose, { Schema } from "mongoose";

interface IListeningChannel {
    channelId: number;
    guildId: string;
}

export interface ISeverConfig {
    wynnGuildId: string;
    discordGuildId: number;
    tomeChannel: number;
    layoffsChannel: number;
    raidsChannel: number;
    warQuestionsChannel: number;
    warChannel: number;
    privilegedRoles: number[];
    invites: string[];
    outgoingInvites: string[];
    listeningChannels: IListeningChannel[];
    broadcastingChannels: number[];
}

const serverConfigSchema: Schema<ISeverConfig> = new Schema({
    wynnGuildId: { type: String, required: true },
    discordGuildId: { type: Number, required: true },
    tomeChannel: { type: Number, required: true, default: -1 },
    layoffsChannel: { type: Number, required: true, default: -1 },
    raidsChannel: { type: Number, required: true, default: -1 },
    warQuestionsChannel: { type: Number, required: true, default: -1 },
    warChannel: { type: Number, required: true, default: -1 },
    privilegedRoles: { type: [{ type: Number, required: true }], required: true, default: [] },
    invites: { type: [{ type: String, required: true }], required: true, default: [] },
    outgoingInvites: { type: [{ type: String, required: true }] },
    listeningChannels: {
        type: [
            {
                channelId: { type: Number, required: true },
                guildId: { type: String, required: true },
            },
        ],
        required: true,
        default: [],
    },
    broadcastingChannels: { type: [{ type: Number, required: true }], required: true, default: [] },
});

/**
 * @property {string} wynnGuildId                              - The guild id a server is connected to.
 * @property {number} discordGuildId                           - The server id a guild is connected to.
 * @property {number} tomeChannel                              - The channel id for tomes, or -1 if not specified.
 * @property {number} layoffsChannel                           - The channel id for layoffs, or -1 if not specified.
 * @property {number} raidsChannel                             - The channel id for raids, or -1 if not specified.
 * @property {number} warQuestionsChannel                      - The channel id for war questions, or -1 if not specified.
 * @property {number} warChannel                               - The channel id for wars, or -1 if not specified.
 * @property {number[]} privelagedRoles                        - The roles in the discord server with additional permissions.
 * @property {string[]} invites                                - The guild ids of guild servers inviting a bridge.
 * @property {string[]} outgoingInvites                        - The guild ids of outgoing invites.
 * @property {IListeningChannel[]} listeningChannels         - The channel ids that are listening for messages.
 * @property {number[]} broadcastingChannels                   - The channel ids to broadcast bridge messages to, not necessarily in the same server.
 */
const ServerConfigModel = mongoose.model("Server Config", serverConfigSchema);

export default ServerConfigModel;
