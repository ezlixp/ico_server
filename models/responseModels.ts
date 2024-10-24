/**
 * Abstract class for base response model.
 * @class ResponseModel
 */
abstract class ResponseModel {
    status: boolean;
    error: string | null;

    protected constructor(status: boolean, error: string | null) {
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
    token: string | null;
    refreshToken: string | null;

    constructor(status: boolean, error: string | null, token: string | null, refreshToken: string | null) {
        super(status, error);
        this.token = token;
        this.refreshToken = refreshToken;
    }
}
