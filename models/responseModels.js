class TokenResponseModel {
    /**
     * Class used to generate a response model containing a token.
     * @param {boolean} status
     * @param {string} token
     * @param {string} error
     */
    constructor(status, token, error) {
        this.status = status;
        this.token = token;
        this.error = error;
    }
}

export default TokenResponseModel;
