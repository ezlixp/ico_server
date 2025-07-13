import { request } from "../globalSetup";

describe("HEAD /", () => {
    it("should pass", async () => {
        const res = await request.head("/");
        expect(res.status).toBe(200);
    });
});
