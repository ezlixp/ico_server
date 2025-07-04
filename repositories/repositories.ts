import { GuildRepository } from "./guildRepository.js";
import { UserRepository } from "./userRepository.js";

export default abstract class Repositories {
    public static user = new UserRepository();
    public static guild = new GuildRepository();
}
