import { RaidService } from "./guild/raidService";
import { TomeService } from "./guild/tomeService";
import { WaitlistService } from "./guild/waitlistService";
import { GuildInfoService } from "./guildInfoService";
import { UserInfoService } from "./userInfoService";

export default abstract class Services {
    public static guildInfo = GuildInfoService.create();
    public static user = UserInfoService.create();
    public static raid = RaidService.create();
    public static tome = TomeService.create();
    public static waitlist = WaitlistService.create();
}
