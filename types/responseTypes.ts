import { Response } from "express";

export interface DefaultResponse<ResBody = null> extends Response<{ error: string } | ResBody> {}
