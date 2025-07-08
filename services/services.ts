import { RaidService } from "./guild/raidService.js";
import { TomeService } from "./guild/tomeService.js";
import { WaitlistService } from "./guild/waitlistService.js";
import { GuildInfoService } from "./GuildInfoService.js";
import { UserInfoService } from "./userInfoService.js";

export default abstract class Services {
    public static guildInfo = GuildInfoService.create();
    public static user = UserInfoService.create();
    public static raid = RaidService.create();
    public static tome = TomeService.create();
    public static waitlist = WaitlistService.create();
}
