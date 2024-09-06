import {Application, Request, Response} from "express";
import UserModel from "../models/userModel.js";
import validateJwtToken from "../security/jwtTokenValidator.js";

/**
 * Maps all aspect-related endpoints.
 */
function mapAspectEndpoints(app: Application): void {
    app.get("/aspects", async (request: Request, response: Response) => {
        try {
            // Get 10 users with the highest aspect count
            const aspects = await UserModel.find({}).sort({aspects: -1}).limit(10);

            response.send(aspects);

            console.log("GET:", aspects);
        } catch (error) {
            response.status(500);
            response.send("Something went wrong processing the request.");
            console.error("getAspectsError:", error);
        }
    });

    app.post("/aspects", validateJwtToken, async (request: Request, response: Response) => {
        try {
            const updatePromises = request.body.users.map((username: string) => {
                UserModel.updateOne(
                    {username: username},
                    {$inc: {aspects: -1}},
                    {
                        upsert: true,
                        collation: {locale: "en", strength: 2},
                    }
                ).then(() => {
                    console.log(username, "received an aspect");
                });
            });
            await Promise.all(updatePromises);

            response.send({err: ""});
        } catch (error) {
            response.status(500);
            response.send({err: "something went wrong"});
            console.error("giveAspectError:", error);
        }
    });
}

export default mapAspectEndpoints;
