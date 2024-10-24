import "jsonwebtoken";
declare module "jsonwebtoken" {
    export interface JwtPayload {
        originalToken: string | undefined;
    }
}
