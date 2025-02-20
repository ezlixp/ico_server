import mongoose, { Schema } from "mongoose";
import { BaseModel } from "./baseModel.js";

// interface IListeningChannel {
//     channelId: number;
//     guildId: string;
// }

export interface IServerConfig extends BaseModel {
    wynnGuildId: string;
    discordGuildId: string;
    tomeChannel: string;
    layoffsChannel: string;
    raidsChannel: string;
    warChannel: string;
    privilegedRoles: string[];
    // invites: string[];
    // outgoingInvites: string[];
    listeningChannel: string;
    broadcastingChannel: string;
}

const serverConfigSchema: Schema<IServerConfig> = new Schema({
    wynnGuildId: { type: String, required: true },
    discordGuildId: { type: String, required: true },
    tomeChannel: { type: String, required: true, default: "0" },
    layoffsChannel: { type: String, required: true, default: "0" },
    raidsChannel: { type: String, required: true, default: "0" },
    warChannel: { type: String, required: true, default: "0" },
    privilegedRoles: { type: [{ type: String, required: true }], required: true, default: [] },
    // invites: { type: [{ type: String, required: true }], required: true, default: [] },
    // outgoingInvites: { type: [{ type: String, required: true }] },
    listeningChannel: { type: String, required: true, default: "0" },
    broadcastingChannel: { type: String, required: true, default: "0" },
});

/**
 * @property {string} wynnGuildId         - The guild id a server is connected to.
 * @property {string} discordGuildId      - The server id a guild is connected to.
 * @property {string} tomeChannel         - The channel id for tomes, or -1 if not specified.
 * @property {string} layoffsChannel      - The channel id for layoffs, or -1 if not specified.
 * @property {string} raidsChannel        - The channel id for raids, or -1 if not specified.
 * @property {string} warChannel          - The channel id for wars, or -1 if not specified.
 * @property {string[]} privilegedRoles   - The roles in the discord server with additional permissions.
 * @property {string} listeningChannel    - The channel ids that are listening for messages.
 * @property {string} broadcastingChannel - The channel ids to broadcast bridge messages to, not necessarily in the same server.
 */
const ServerConfigModel = mongoose.model("Server Config", serverConfigSchema);

export default ServerConfigModel;
