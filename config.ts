import path from "path";
import dotenv from "dotenv";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile: string = ".env." + process.env.NODE_ENV;
export const API_VERSION = 'v2';

dotenv.config({path: path.resolve(__dirname, envFile)});

export default dotenv;
