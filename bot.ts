import { Client, GatewayIntentBits } from "discord.js";
import "./config.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once("ready", () => {
    console.log("Bot is online!");
});

client.login(process.env.DISCORD_BOT_TOKEN);

export default client;
