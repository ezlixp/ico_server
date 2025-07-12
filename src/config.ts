import path from "path";
import dotenv from "dotenv";

const envFile: string = ".env." + process.env.NODE_ENV;
export const API_VERSION = "v3";

if (process.env.NODE_ENV !== "test") dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log(process.env.NODE_ENV);

export default dotenv;
