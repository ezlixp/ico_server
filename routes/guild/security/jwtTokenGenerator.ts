import jwt from "jsonwebtoken";
import "../config.ts";
import { TokenResponseModel } from "../../../models/responseModels.js";
import ValidationModel from "../../../models/validationModel.js";

const secretKey = process.env.JWT_SECRET_KEY;
const refreshKey = process.env.JWT_REFRESH_SECRET_KEY || "placeholder";
const options: jwt.SignOptions = { expiresIn: "24h" };

/**
 * Generates a JWT if the validation key is valid.
 */
export default async function generateJwtToken(
    validationKey: string,
    wynnGuildId: string
): Promise<TokenResponseModel> {
    // Validate the validation key
    if (validationKey === process.env.JWT_VALIDATION_KEY && wynnGuildId === "*") {
        return signJwtToken("to be implemented", "*");
    }
    const guild = await ValidationModel.findOne({ validationKey: validationKey }).exec();
    if (!guild) {
        return new TokenResponseModel(false, null, null, "Invalid validation key.");
    }
    if (guild.wynnGuildId !== wynnGuildId) {
        return new TokenResponseModel(false, null, null, "Invalid validation key.");
    }

    // Generate the token
    return signJwtToken("to be implemented", wynnGuildId);
}

export function signJwtToken(username: string, guildId: string): TokenResponseModel {
    let response: TokenResponseModel;
    try {
        const jwtToken = jwt.sign({ username: username, guildId: guildId }, secretKey, options);
        const refreshToken = jwt.sign({ username: "placeholder", guildId: guildId }, refreshKey, { expiresIn: "7d" });

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
