import jwt from 'jsonwebtoken';
import TokenResponseModel from "../models/responseModels.js";

const secretKey = "secret-key";
const options = {expiresIn: "24h"};


// Generates a JWT if the validation key is valid.
// Returns an object containing success status, the token
// and any error messages if failure to generate token.
function generateJwtToken(validationKey) {

    // Validate key sent
    if (validationKey !== "PlaceboValidationKey")
        return new TokenResponseModel(
            false,
            null,
            "Invalid validation key."
        );

    // Generate the token
    let response;
    try {
        const jwtToken = jwt.sign({}, secretKey, options);

        response = new TokenResponseModel(
            true,
            jwtToken,
            null
        );
    } catch (error) {
        response = new TokenResponseModel(
            false,
            null,
            "There was an error creating the token: " + error.message
        );
    }

    return response;
}

export default generateJwtToken;