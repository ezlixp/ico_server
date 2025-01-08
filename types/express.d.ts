declare namespace Express {
    export interface Request {
        // wynnGuildId?: string;
        // serverQuery?: import("mongoose").Query<
        //     | (import("mongoose").Document<unknown, {}, import("../models/serverConfigModel.ts").ISeverConfig> &
        //           import("../models/serverConfigModel.ts").ISeverConfig)
        //     | null,
        //     import("mongoose").Document<unknown, {}, import("../models/serverConfigModel.ts").ISeverConfig> &
        //         import("../models/serverConfigModel.ts").ISeverConfig,
        //     {},
        //     import("../models/serverConfigModel.ts").ISeverConfig,
        //     "findOne",
        //     {}
        // >;
        discordGuildId?: string;
        serverConfig?: import("mongoose").Document<
            unknown,
            {},
            import("../models/serverConfigModel.ts").IServerConfig
        > &
            import("../models/serverConfigModel.ts").IServerConfig;
    }
}
