import jwt from "jsonwebtoken";
import { TokenResponseModel } from "../models/responseModels.js";
import "../config.ts";

const secretKey = process.env.JWT_SECRET_KEY as string;
const options: jwt.SignOptions = { expiresIn: "6h" };

/**
 * Generates a JWT if the validation key is valid.
 */
function generateJwtToken(validationKey: string): TokenResponseModel {
    // Validate key sent
    if (validationKey !== process.env.JWT_VALIDATION_KEY)
        return new TokenResponseModel(false, "Invalid validation key.", null, null);

    // Generate the token
    let response: TokenResponseModel;
    try {
        const jwtToken = jwt.sign({}, secretKey, options);
        const refreshToken = jwt.sign({ originalToken: jwtToken }, secretKey, { expiresIn: "7d" });

        response = new TokenResponseModel(true, null, jwtToken, refreshToken);
    } catch (error) {
        response = new TokenResponseModel(
            false,
            "There was an error creating the token: " + (error as Error).message,
            null,
            null
        );
    }

    return response;
}

export default generateJwtToken;
