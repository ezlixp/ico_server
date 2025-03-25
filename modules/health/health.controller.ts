import 'reflect-metadata';
import { Request } from 'express';
import { DefaultResponse } from '../../communication/responses/defaultResponse.js';
import { HealthStatus } from './health-status.js';
import { Get, JsonController } from 'routing-controllers';
import { BASE_API_URI } from '../../config.js';

@JsonController(BASE_API_URI + '/healthz')
export class HealthController {
    @Get()
    getHealthStatus(request: Request, response: DefaultResponse) {
        response.status(200).send(HealthStatus.Healthy);
    }
}
