import 'reflect-metadata';
import { Body, HttpCode, JsonController, Post } from 'routing-controllers';
import { BASE_API_URI } from '../../config.js';
import { CreateGuildRequest } from '../../communication/requests/createGuildRequest.js';
import { IGuild } from '../../models/entities/guildModel.js';
import { GuildService } from './guild.service.js';

@JsonController(BASE_API_URI + '/guilds')
export class GuildController {
    constructor(private readonly guildService: GuildService) {}

    @Post()
    @HttpCode(200)
    async CreateGuild(@Body() request: CreateGuildRequest) {
        const guild: IGuild = {
            validationKey: request.validationKey,
            wynnGuildId: request.wynnGuildId,
            wynnGuildName: request.wynnGuildName,
        };

        return await this.guildService.createNewGuild(guild);
    }
}
