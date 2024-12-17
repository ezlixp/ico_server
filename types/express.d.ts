declare namespace Express {
    export interface Request {
        guildId?: string;
        serverQuery?: import("mongoose").Query<
            | (import("mongoose").Document<unknown, {}, import("../models/serverConfigModel.ts").ISeverConfig> &
                  import("../models/serverConfigModel.ts").ISeverConfig)
            | null,
            import("mongoose").Document<unknown, {}, import("../models/serverConfigModel.ts").ISeverConfig> &
                import("../models/serverConfigModel.ts").ISeverConfig,
            {},
            import("../models/serverConfigModel.ts").ISeverConfig,
            "findOne",
            {}
        >;
        serverConfig?: import("mongoose").Document<unknown, {}, import("../models/serverConfigModel.ts").ISeverConfig> &
            import("../models/serverConfigModel.ts").ISeverConfig;
    }
}
