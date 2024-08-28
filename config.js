import path from "path";
import dotenv from "dotenv";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = ".env." + process.env.NODE_ENV;

dotenv.config({path: path.resolve(__dirname, envFile)});

export default dotenv;
