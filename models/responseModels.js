// Class used to generate a response model with a token.
// Has 3 attributes:
// status: Boolean, token: String, error: String
class TokenResponseModel {
	constructor(status, token, error) {
		this.status = status;
		this.token = token;
		this.error = error;
	}
}

export default TokenResponseModel;
