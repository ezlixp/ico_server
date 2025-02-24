import { Controller, Get } from 'routing-controllers';
import { BASE_API_URI } from '../../config.js';
import { IModVersionResponse } from '../../utils/versionUtils.js';

@Controller(BASE_API_URI + '/mod')
export class VersionController {
    @Get('update')
    async getLatestVersion() {
        return await this.getLatestVersionFromModrinth();
    }

    private async getLatestVersionFromModrinth() {
        const url = 'https://api.modrinth.com/v2/project/guild-api/version';
        const response = await fetch(url);
        const responseJson = await response.json();

        const versionResponse: IModVersionResponse = {
            versionNumber: responseJson[0].versionNumber,
            download: responseJson[0].files[0].url,
        };

        return versionResponse;
    }
}
