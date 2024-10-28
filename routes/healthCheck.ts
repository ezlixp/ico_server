import { Request, Response, Router } from "express";

/**
 * Maps a health check endpoint
 */
const healthRouter = Router();

healthRouter.get("/", (request: Request, response: Response) => {
    response.send("");
});

export default healthRouter;
