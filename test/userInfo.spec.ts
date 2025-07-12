import { describe, it, expect, afterAll, beforeAll } from "@jest/globals";
import UserModel from "../src/models/entities/userModel";
import { JwtTokenHandler } from "../src/security/jwtHandler";
import { UserErrors } from "../src/errors/messages/userErrors";
import { API_VERSION } from "../src/config";
import { authHeader, request } from "./globalSetup";

describe("User info routes", () => {
    let token: string;
    beforeAll(async () => {
        await UserModel.insertMany([
            {
                discordUuid: "752610633580675176",
                banned: false,
                blocked: ["pixlze", "pixlze2"],
                mcUuid: "39365bd45c7841de8901c7dc5b7c64c4",
                muted: false,
                refreshToken: "no",
                verified: true,
            },
            {
                discordUuid: "752610633580675176",
                banned: false,
                blocked: ["pixlze3", "pixlze4"],
                mcUuid: "21",
                muted: false,
                refreshToken: "no",
                verified: true,
            },
        ]);
        token = (await JwtTokenHandler.create().generateAdminToken()).token!;
    });
    afterAll(async () => {
        console.log("\x1b[42mfinal usermodel: \x1b[0m", await UserModel.find());
        await UserModel.deleteMany();
    });

    describe(`GET /api/${API_VERSION}/user/blocked/:mcUuid`, () => {
        it("should return all blocked users", async () => {
            const res = await request
                .get("/api/v3/user/blocked/39365bd45c7841de8901c7dc5b7c64c4")
                .set({ authorization: "bearer " + token });
            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual(["pixlze", "pixlze2"]);

            const res2 = await request.get("/api/v3/user/blocked/21").set(await authHeader);
            expect(res2.status).toBe(200);
            expect(res2.body).toStrictEqual(["pixlze3", "pixlze4"]);
        });

        it("should handle missing users", async () => {
            const res = await request.get("/api/v3/user/blocked/missing").set(await authHeader);
            expect(res.status).toBe(404);
            expect(res.body).toStrictEqual({
                status: 404,
                title: "Error",
                errorMessage: UserErrors.NOT_FOUND,
            });
        });
    });

    describe(`POST api/${API_VERSION}/user/blocked/:mcUuid`, () => {
        it("should add a blocked user", async () => {
            const res = await request
                .post("/api/v3/user/blocked/39365bd45c7841de8901c7dc5b7c64c4")
                .send({ toBlock: "newblocked" })
                .set(await authHeader);
            expect(res.status).toBe(200);
            expect(res.body.blocked).toContain("newblocked");
        });

        it("should handle missing toBlock field", async () => {
            const res = await request
                .post("/api/v3/user/blocked/39365bd45c7841de8901c7dc5b7c64c4")
                .set(await authHeader);
            expect(res.status).toBe(500);
        });
    });
});
