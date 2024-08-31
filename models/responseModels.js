/**
 * Abstract class.
 * @class ResponseModel
 */
class ResponseModel {
    /**
     * Class used to generate a base response model a status and an error.
     * @param {boolean} status
     * @param {string} error
     */
    constructor(status, error) {
        this.status = status;
        this.error = error;
    }
}

/**
 * Class used to generate a response model containing a token.
 * @class TokenResponseModel
 * @extends ResponseModel
 */
export class TokenResponseModel extends ResponseModel {
    /**
     * @param {boolean} status
     * @param {string} error
     * @param {string} token
     */
    constructor(status, error, token) {
        super(status, error);
        this.token = token;
    }
}