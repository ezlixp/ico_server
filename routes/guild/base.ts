import { Router } from "express";
import onlineRouter from "./online.js";
import raidRouter from "./raids.js";
import tomeRouter from "./tomes.js";
import waitlistRouter from "./waitlist.js";
import { GuildRequest } from "../../communication/requests/guildRequest.js";
import { DefaultResponse } from "../../communication/responses/defaultResponse.js";
import { guildNames } from "../../models/entities/guildDatabaseModel.js";
import { NotFoundError } from "../../errors/implementations/notFoundError.js";

const guildRouter = Router({ mergeParams: true });

guildRouter.get("/:wynnGuildId", async (request: GuildRequest, response: DefaultResponse) => {
    const wynnGuildId = request.params.wynnGuildId;
    if (wynnGuildId in guildNames) {
        response.send(guildNames[wynnGuildId]);
        return;
    }
    throw new NotFoundError("Guild not found.");
});

// map extras
guildRouter.use("/online", onlineRouter);
guildRouter.use("/raids", raidRouter);
guildRouter.use("/tomes", tomeRouter);
guildRouter.use("/waitlist", waitlistRouter);

export default guildRouter;
