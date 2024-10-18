import { Request, Response, Router } from "express";

/**
 * Maps all health check related endpoints.
 */
const healthRouter = Router();

healthRouter.get("/", (request: Request, response: Response) => {
    response.send("");
});

export default healthRouter;
