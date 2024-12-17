declare namespace Express {
    export interface Request {
        guildId?: string;
        serverQuery?: import("mongoose").Query;
        serverConfig?: import("mongoose").Document<unknown, {}, import("../models/serverConfigModel.ts").ISeverConfig> &
            import("../models/serverConfigModel.ts").ISeverConfig;
    }
}
