import express, {json} from "express";
import {connect} from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import mapRaidEndpoints from "./routes/raids.js";
import mapAuthenticationEndpoints from "./routes/authentication.js";
import "./config.js";
import mapAspectEndpoints from "./routes/aspects.js";
import mapTomeEndpoints from "./routes/tomes.js";
import mapWaitlistEndpoints from "./routes/waitlist.js";

const app = express();

app.use(json());
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

// Connect to database
try {
    connect(process.env.DB_URL).then(() => {
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
}

// Map endpoints
mapAuthenticationEndpoints(app);
mapRaidEndpoints(app);
mapAspectEndpoints(app);
mapTomeEndpoints(app);
mapWaitlistEndpoints(app);