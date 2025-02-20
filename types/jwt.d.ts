import "jsonwebtoken";
declare module "jsonwebtoken" {
    export interface JwtPayload {
        username: string;
        guildId: string;
    }
}
