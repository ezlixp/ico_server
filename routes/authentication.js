import generateJwtToken from "../security/jwtTokenGenerator.js";

const ENDPOINT_PREFIX = "/auth";

function mapAuthenticationEndpoints(app) {
	app.post(`${ENDPOINT_PREFIX}/getToken`, async (request, response) => {
		// Gets a token if correct validationKey is provided
		const validationKey = request.body.validationKey;
		const result = generateJwtToken(validationKey);

		if (result.status) {
			response.status(200).json(result);
		} else {
			response.status(400).json(result);
		}
	});
}

export default mapAuthenticationEndpoints;
