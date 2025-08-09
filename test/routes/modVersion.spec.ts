import { API_VERSION } from "../../src/config";
import { request } from "../globalSetup";

describe(`GET /api/${API_VERSION}/mod/update`, () => {
    it("should send latest version", async () => {
        const res = await request.get(`/api/${API_VERSION}/mod/update`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("versionNumber");
        expect(res.body).toHaveProperty("download");
    });
});
