import jwt from "jsonwebtoken";
import "../config.js";
import {TokenResponse} from "../communication/responses/tokenResponse.js";
import ValidationModel, {IValidation} from "../models/validationModel.js";
import {TokenError} from "../errors/implementations/tokenError.js";

export class JwtTokenHandler {
    private readonly secretKey: string;
    private readonly refreshKey: string;
    private readonly options: jwt.SignOptions;

    constructor() {
        this.secretKey = process.env.JWT_SECRET_KEY;
        this.refreshKey = process.env.JWT_REFRESH_SECRET_KEY || "placeholder";
        this.options = {expiresIn: "24h"};
    }

    async generateToken(
        validationKey: string,
        wynnGuildId: string
    ): Promise<TokenResponse> {
        if (validationKey === process.env.JWT_VALIDATION_KEY && wynnGuildId === "*") {
            return this.signJwtToken("to be implemented", "*");
        }

        // TODO: make repository for ValidationModel to substitute this call
        const guild: IValidation = await ValidationModel.findOne({validationKey: validationKey}).exec();

        this.validateGeneration(guild, wynnGuildId);

        return this.signJwtToken("to be implemented", wynnGuildId);
    }

    private validateGeneration(guild: IValidation, wynnGuildId: string) {
        if (!guild) {
            throw new TokenError();
        }
        if (guild.wynnGuildId !== wynnGuildId) {
            throw new TokenError();
        }
    }

    private signJwtToken(username: string, guildId: string): TokenResponse {
        let response: TokenResponse;

        const jwtToken = jwt.sign({username: username, guildId: guildId}, this.secretKey, this.options);
        const refreshToken = jwt.sign({username: "placeholder", guildId: guildId}, this.refreshKey, {expiresIn: "7d"});

        response = new TokenResponse(jwtToken, refreshToken);
        return response;
    }

}

