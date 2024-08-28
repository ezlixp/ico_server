import jwt from "jsonwebtoken";
import TokenResponseModel from "../models/responseModels.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;
const options = {expiresIn: "24h"};

// Generates a JWT if the validation key is valid.
// Returns an object containing success status, the token
// and any error messages if failure to generate token.
function generateJwtToken(validationKey) {
	// Validate key sent
	if (validationKey !== process.env.JWT_VALIDATION_KEY)
		return new TokenResponseModel(false, null, "Invalid validation key.");

	// Generate the token
	let response;
	try {
		const jwtToken = jwt.sign({}, secretKey, options);

		response = new TokenResponseModel(true, jwtToken, null);
	} catch (error) {
		response = new TokenResponseModel(false, null, "There was an error creating the token: " + error.message);
	}

	return response;
}

export default generateJwtToken;
