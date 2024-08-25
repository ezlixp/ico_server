import dotenv from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import raidModel from "./models/raidModel.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
connect(process.env.DB_URL)
    .then(() => {
        const PORT = 3000 || process.env.PORT;
        app.listen(PORT);
        console.log(`running on port ${PORT}`);
    })
    .catch((error) => {
        console.log(error);
    });

app.post("/addRaid", async (req, res) => {
    const newRaid = new raidModel(req.body);
    newRaid
        .save()
        .then(() => {
            res.send({ err: "" });
        })
        .catch((error) => {
            res.send({ err: "something went wrong" });
            console.log(error);
        });
});

app.get("/getRaids", (req, res) => {
    raidModel.find({}).then((r) => {
        res.send(r);
        console.log(r);
    });
});
