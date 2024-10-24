import { TokenResponseModel } from "../models/responseModels.js";
import jwt from "jsonwebtoken";
import "../config.js";
import generateJwtToken from "./jwtTokenGenerator.js";

/** Refreshes a JWT token if the refresh token is valid
 * @param {string} originalToken Original jwt token
 * @param {string} refreshToken Refresh token supplied with the original token
 */
const secretKey = process.env.JWT_SECRET_KEY;
export default function refreshJwtToken(originalToken: string, refreshToken: string): TokenResponseModel {
    let validOriginalToken = false;
    jwt.verify(originalToken, secretKey, (err) => {
        if (err && err.message !== "jwt expired") return;
        validOriginalToken = true;
    });
    if (!validOriginalToken) return new TokenResponseModel(false, "Invalid original token provided.", null, null);

    let validRefreshToken = false;
    jwt.verify(refreshToken, secretKey, (err) => {
        const decoded = jwt.decode(refreshToken);
        if (err || typeof decoded !== "object" || decoded?.originalToken !== originalToken) return;
        validRefreshToken = true;
    });

    if (!validRefreshToken) return new TokenResponseModel(false, "Invalid refresh token provided.", null, null);

    return generateJwtToken(process.env.JWT_VALIDATION_KEY);
}
