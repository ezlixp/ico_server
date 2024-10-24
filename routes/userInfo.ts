import { Request, Response, Router } from "express";
import validateJwtToken from "../security/jwtTokenValidator.js";
import updateAspects from "../sockets/updateAspects.js";
import UserModel from "../models/userModel.js";
import { UUIDtoUsername } from "../services/ConvertMinecraftUser.js";

/**Maps all endpoints related to user information. */
const userInfoRouter = Router();
userInfoRouter.use(validateJwtToken);

userInfoRouter.post("/aspects", async (request: Request<{}, {}, { username: string }>, response: Response) => {
    try {
        const username = request.body.username;
        await updateAspects(username);
        response.send();
    } catch (error) {
        console.log("update aspects error:", error);
        response.status(500).send({ error: "something went wrong" });
    }
});

userInfoRouter.get("/blocked/:uuid", async (request: Request<{ uuid: string }, {}, {}>, response: Response) => {
    try {
        const uuid = request.params.uuid.replaceAll("-", "");
        const user = await UserModel.findOneAndUpdate(
            { uuid: uuid },
            { username: await UUIDtoUsername(uuid) },
            { upsert: true, new: true, collation: { locale: "en", strength: 2 } }
        );
        response.send(user.blocked);
    } catch (error) {
        console.log("get blocked error:", error);
        response.status(500).send({ error: "something went wrong" });
    }
});

userInfoRouter.post(
    "/blocked/:uuid",
    async (request: Request<{ uuid: string }, {}, { toBlock: string }>, response: Response) => {
        try {
            const toBlock = request.body.toBlock;
            const uuid = request.params.uuid.replaceAll("-", "");
            await UserModel.updateOne(
                { uuid: uuid },
                { username: await UUIDtoUsername(uuid), $addToSet: { blocked: toBlock } },
                { upsert: true, new: true, collation: { locale: "en", strength: 2 } }
            );
            response.send({ error: "" });
        } catch (error) {
            console.log("update blocked error:", error);
            response.status(500).send({ error: "something went wrong" });
        }
    }
);

export default userInfoRouter;
