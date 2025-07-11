import test, { describe } from "node:test";
import { server } from "../src/socket";
import supertest from "supertest";

describe("GET /api/v3/blocked/:mcUuid", function () {
    //     beforeEach
    //     console.log("beforing");
    //     const pix = new UserModel({
    //         discordUuid: "752610633580675176",
    //         banned: false,
    //         blocked: [],
    //         mcUuid: "39365bd45c7841de8901c7dc5b7c64c4",
    //         muted: false,
    //         refreshToken: "no",
    //         verified: true,
    //     })
    //         .save()
    //         .then(done);
    // });
    test("should return all blocked users", function () {
        const ignore = supertest(server)
            .get("/api/v3/user/blocked/39365bd45c7841de8901c7dc5b7c64c4")
            .set({ authorization: "bearer " + "2" });
        console.log(ignore);
        // // console.log(res);
        // console.log(await UserModel.find());
    });
});
