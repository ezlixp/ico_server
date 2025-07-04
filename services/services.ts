import { GuildService } from "./guild/guildService.js";
import { RaidService } from "./guild/raidService.js";
import { TomeService } from "./guild/tomeService.js";
import { WaitlistService } from "./guild/waitlistService.js";
import { UserInfoService } from "./userInfoService.js";

export default abstract class Services {
    public static user = UserInfoService.create();
    public static guild = GuildService.create();
    public static raid = RaidService.create();
    public static tome = TomeService.create();
    public static waitlist = WaitlistService.create();
}
