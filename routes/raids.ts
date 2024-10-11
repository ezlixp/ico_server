import RaidModel from "../models/raidModel.js";
import { Request, Response, Router } from "express";

interface RaidRequestBody {
    users: string[];
    raid: string;
    timestamp: number;
}

/**
 * Maps all raid-related endpoints.
 */
const raidRouter = Router();

raidRouter.get("/raids", async (request: Request, response: Response) => {
    try {
        const raids = await RaidModel.find({});
        response.status(200);
        response.send(raids);

        console.log("GET:", raids);
    } catch (error) {
        response.status(500);
        response.send("Something went wrong processing the request.");
        console.error("getRaidsError:", error);
    }
});

export default raidRouter;
