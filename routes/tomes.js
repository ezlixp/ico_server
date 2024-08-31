import {request, response} from "express";
import validateJwtToken from "../security/jwtTokenValidator.js";
import TomeModel from "../models/tomeModel.js";

/**
 * Maps all tome-related endpoints
 * @param {Express} app
 */
export function mapTomeEndpoints(app) {
    app.get("/tomes", async (request, response) => {
        try {
            // Get 10 users ordered by time added
            const tomeList = await TomeModel
                .find({})
                .sort({dateAdded: -1});

            response.status(200).send(tomeList);

            console.log("GET:", tomeList)
        } catch (error) {
            response.status(500);
            response.send("Something went wrong processing the request.");
            console.error("getTomesError:", error);
        }
    });
}