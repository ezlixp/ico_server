import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { mapEndpoints } from "./endpoints";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

mapEndpoints(app);
app.use(errorHandler);

export default app;
