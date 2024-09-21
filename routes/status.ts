import {Application, Request, Response, Router} from "express";

/**
 * Maps all status-related endpoints
 */
const statusRouter = Router();

statusRouter.head("/", (request: Request, response: Response) => {
    response.send();
});

export default statusRouter;
