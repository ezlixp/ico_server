import { TokenResponseModel } from "../models/responseModels.js";
import jwt from "jsonwebtoken";
import "../config.js";
import { signJwtToken } from "./jwtTokenGenerator.js";

/** Refreshes a JWT token if the refresh token is valid
 * @param {string} refreshToken Refresh token supplied that will be revoked after one use
 */
const refreshKey = process.env.JWT_REFRESH_SECRET_KEY || "placeholder";
export default function refreshJwtToken(refreshToken: string): TokenResponseModel {
    let validRefreshToken = false;
    const decoded = jwt.decode(refreshToken);
    if (!decoded || typeof decoded !== "object")
        return new TokenResponseModel(false, null, null, "Malformed token payload.");
    jwt.verify(refreshToken, refreshKey, (err) => {
        if (err) return;
        validRefreshToken = true;
    });
    // if valid jwt token and should be revoked, alarm bells here

    if (!validRefreshToken) return new TokenResponseModel(false, null, null, "Invalid refresh token provided.");

    // TODO: revoke current refresh token here
    return signJwtToken(decoded.username!);
}
