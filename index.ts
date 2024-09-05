import express, { Application } from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import mapRaidEndpoints from "./routes/raids";
import mapAuthenticationEndpoints from "./routes/authentication";
import "./config";
import mapAspectEndpoints from "./routes/aspects";
import mapTomeEndpoints from "./routes/tomes";
import mapWaitlistEndpoints from "./routes/waitlist";
import mapStatusEndpoints from "./routes/status";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
try {
    const dbUrl: string = process.env.DB_URL as string;

    connect(dbUrl).then(() => {
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
}

// Map endpoints
mapStatusEndpoints(app);
mapAuthenticationEndpoints(app);
mapRaidEndpoints(app);
mapAspectEndpoints(app);
mapTomeEndpoints(app);
mapWaitlistEndpoints(app);
