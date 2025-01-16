import { Request } from "express";

export interface GuildRequest<Params = {}, ResBody = any, ReqBody = any, ReqQuery = any>
    extends Request<{ wynnGuildId: string } & Params, ResBody, ReqBody, ReqQuery> {}
