import ServerConfigModel, { IServerConfig } from "../models/entities/serverConfigModel.js";
import { BaseRepository } from "./base/baseRepository.js";

export class ServerRepository extends BaseRepository<IServerConfig> {
    constructor() {
        super(ServerConfigModel);
    }
}
