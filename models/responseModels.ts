/**
 * Abstract class for base response model.
 * @class ResponseModel
 */
abstract class ResponseModel {
    status: boolean;
    error?: string;

    protected constructor(status: boolean, error?: string) {
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

    constructor(status: boolean, token: string | null, refreshToken: string | null, error?: string) {
        super(status, error);
        this.token = token;
        this.refreshToken = refreshToken;
    }
}
