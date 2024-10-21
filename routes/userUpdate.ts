import { Request, Response, Router } from "express";
import validateJwtToken from "../security/jwtTokenValidator.js";
import updateAspects from "../sockets/updateAspects.js";
import UserModel from "../models/userModel.js";

/**Maps all endpoints related to updating user information. */
const userUpdateRouter = Router();
userUpdateRouter.use(validateJwtToken);

userUpdateRouter.post("/aspects", async (request: Request<{}, {}, { username: string }>, response: Response) => {
    try {
        const username = request.body.username;
        await updateAspects(username);
        response.send();
    } catch (error) {
        console.log("update aspects error:", error);
        response.status(500).send({ error: "something went wrong" });
    }
});

userUpdateRouter.post(
    "/blocked/:uuid",
    async (request: Request<{ uuid: string }, {}, { toBlock: string }>, response: Response) => {
        try {
            const toBlock = request.body.toBlock;
            await UserModel.updateOne(
                { uuid: request.params.uuid },
                { $push: { blocked: toBlock } },
                { upsert: true, collation: { locale: "en", strength: 2 } }
            );
            response.send();
        } catch (error) {
            console.log("update blocked error:", error);
            response.status(500).send({ error: "somethign went wrong" });
        }
    }
);

export default userUpdateRouter;
