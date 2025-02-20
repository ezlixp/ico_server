import {Response} from "express";

export interface DefaultResponse<ResBody = {}> extends Response<{ error: string } | ResBody> {
}