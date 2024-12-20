import jwt from "jsonwebtoken";
import { TokenResponseModel } from "../models/responseModels.js";
import "../config.ts";

const secretKey = process.env.JWT_SECRET_KEY;
const refreshKey = process.env.JWT_REFRESH_SECRET_KEY || "placeholder";
const options: jwt.SignOptions = { expiresIn: "24h" };

/**
 * Generates a JWT if the validation key is valid.
 */
export default function generateJwtToken(validationKey: string): TokenResponseModel {
    // Validate key sent
    if (validationKey !== process.env.JWT_VALIDATION_KEY)
        return new TokenResponseModel(false, null, null, "Invalid validation key.");

    // Generate the token
    return signJwtToken("to be implemented");
}

export function signJwtToken(username: string): TokenResponseModel {
    let response: TokenResponseModel;
    try {
        const jwtToken = jwt.sign({ username: username }, secretKey, options);
        const refreshToken = jwt.sign({ username: "placeholder" }, refreshKey, { expiresIn: "7d" });

        response = new TokenResponseModel(true, jwtToken, refreshToken);
    } catch (error) {
        response = new TokenResponseModel(
            false,
            null,
            null,
            "There was an error creating the token: " + (error as Error).message
        );
    }
    return response;
}
