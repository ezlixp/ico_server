import { Application, Request, Response } from "express";

/**
 * Maps all status-related endpoints
 */
function mapStatusEndpoints(app: Application) {
    app.head("/", (request: Request, response: Response) => {
        response.send();
    });
}

export default mapStatusEndpoints;
