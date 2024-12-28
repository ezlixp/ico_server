/** Refreshes a JWT token if the refresh token is valid
 * @param {string} refreshToken Refresh token supplied that will be revoked after one use
 */
// const refreshKey = process.env.JWT_REFRESH_SECRET_KEY || "placeholder";
// export default function refreshJwtToken(refreshToken: string): TokenResponseModel {
//     let validRefreshToken = false;
//     const decoded = jwt.decode(refreshToken);
//     if (!decoded || typeof decoded !== "object")
//         return new TokenResponseModel(false, null, null, "Malformed token payload.");
//     jwt.verify(refreshToken, refreshKey, (err) => {
//         if (err) return;
//         validRefreshToken = true;
//     });
//     // if a refresh token is already revoked on database, revoke all children refresh tokens as refresh tokens should not be reused

//     if (!validRefreshToken) return new TokenResponseModel(false, null, null, "Invalid refresh token provided.");

//     // TODO: revoke current refresh token here
//     return signJwtToken(decoded.username!);
// }
