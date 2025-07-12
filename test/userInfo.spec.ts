import { describe, it, expect, afterAll, beforeAll } from "@jest/globals";
import UserModel from "../src/models/entities/userModel";
import { server } from "../src/socket";
import request from "supertest";
import { JwtTokenHandler } from "../src/security/jwtHandler";

describe("GET /api/v3/blocked/:mcUuid", () => {
    let token: string;
    beforeAll(async () => {
        await new UserModel({
            discordUuid: "752610633580675176",
            banned: false,
            blocked: ["pixlze", "pixlze2"],
            mcUuid: "39365bd45c7841de8901c7dc5b7c64c4",
            muted: false,
            refreshToken: "no",
            verified: true,
        }).save();
        token = (await JwtTokenHandler.create().generateAdminToken()).token!;
    });
    afterAll(async () => {
        await UserModel.deleteMany();
    });
    it("should return all blocked users", async () => {
        const res = await request(server)
            .get("/api/v3/user/blocked/39365bd45c7841de8901c7dc5b7c64c4")
            .set({ authorization: "bearer " + token });
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(["pixlze", "pixlze2"]);
    });
});
