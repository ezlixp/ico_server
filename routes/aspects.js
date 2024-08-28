function mapAspectEndpoints(app) {
  app.get("/getAspectsOwed", async (request, response) => {
    try {
      const aspects = await UserModel.find({});
      response.status(200);
      response.send(aspects);

      console.log("GET:", aspects);
    } catch (error) {
      response.status(500);
      response.send("Something went wrong processing the request.");
      console.error("getAspectsError:", error);
    }
  });

  app.post("/giveAspect", validateJwtToken, async (request, response) => {
    try {
      request.body.users.forEach((user) => {
        userModel
          .updateOne(
            { user: user },
            { $inc: { aspects: -1 } },
            { upsert: true }
          )
          .then((res) => {
            console.log(user, "receieved an aspect");
          });
      });
      response.send({ err: "" });
    } catch (error) {
      response.status(500);
      response.send({ err: "something went wrong" });
      console.error("giveAspectError:", error);
    }
  });
}
