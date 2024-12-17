import mongoose, { Schema } from "mongoose";

export interface ISeverConfig extends Document {
    guildId: String;
    serverId: Number;
    tomeChannel: Number;
    layoffsChannel: Number;
    raidsChannel: Number;
    warQuestionsChannel: Number;
    warChannel: Number;
    privilagedRoles: [Number];
    broadcastChannelIds: [Number];
}

const serverConfigSchema: Schema<ISeverConfig> = new Schema({
    guildId: { type: String, required: true },
    serverId: { type: Number, required: true },
    tomeChannel: { type: Number, required: true, default: -1 },
    layoffsChannel: { type: Number, required: true, default: -1 },
    raidsChannel: { type: Number, required: true, default: -1 },
    warQuestionsChannel: { type: Number, required: true, default: -1 },
    warChannel: { type: Number, required: true, default: -1 },
    privilagedRoles: { type: [Number], required: true, default: [] },
    broadcastChannelIds: { type: [Number], required: true, default: [] },
});

/**
 * @property {String} guildId               - The guild id a server is connected to.
 * @property {Number} serverId              - The server id a guild is connected to.
 * @property {Number} tomeChannel           - The channel id for tomes, or -1 if not specified.
 * @property {Number} layoffsChannel        - The channel id for layoffs, or -1 if not specified.
 * @property {Number} raidsChannel          - The channel id for raids, or -1 if not specified.
 * @property {Number} warQuestionsChannel   - The channel id for war questions, or -1 if not specified.
 * @property {Number} warChannel            - The channel id for wars, or -1 if not specified.
 * @property {[Number]} privelagedRoles     - The roles in the discord server with additional permissions.
 * @property {[Number]} broadcastChannelIds - The channel ids to broadcast bridge messages to, not necessarily in the same server.
 */
const serverConfigModel = mongoose.model("Server Config", serverConfigSchema);

export default serverConfigModel;
