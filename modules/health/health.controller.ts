import { injectable, singleton } from 'tsyringe';
import { HttpGet } from '../../decorators/http.methods.js';
import { Request } from 'express';
import { DefaultResponse } from '../../communication/responses/defaultResponse.js';
import { HealthStatus } from './health-status.js';

@injectable()
@singleton()
export class HealthController {
    @HttpGet()
    getHealthStatus(request: Request, response: DefaultResponse) {
        response.status(200).send(HealthStatus.Healthy);
    }
}
