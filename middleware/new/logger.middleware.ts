import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class LoggerMiddleware implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: (err?: any) => any) {
        const timestamp = new Date().toISOString();
        console.log(
            `[${timestamp}] METHOD: ${request.method}
             | REQUEST_URL: ${request.url} 
             | STATUS: ${response.status}`,
        );
        next();
    }
}
