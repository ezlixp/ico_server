import { Request, Response, Router } from "express";

/**
 * Maps an app status checking endpoint
 */
const statusRouter = Router();

statusRouter.head("/", (request: Request, response: Response) => {
    response.send();
});

export default statusRouter;
