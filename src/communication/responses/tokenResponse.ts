export class TokenResponse {
    token: string | null;
    refreshToken: string | null;

    constructor(token: string | null, refreshToken: string | null) {
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

// TODO add standard api response model, using mongoose's find query projection parameter to only send what is necessary
