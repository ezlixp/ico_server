import jwt from "jsonwebtoken";
import "../config.js";
import {TokenResponse} from "../communication/responses/tokenResponse.js";
import {IValidation} from "../models/validationModel.js";
import {TokenError} from "../errors/implementations/tokenError.js";
import {ValidationRepository} from "../repositories/validationRepository.js";

export class JwtTokenHandler {
    private readonly secretKey: string;
    private readonly refreshKey: string;
    private readonly options: jwt.SignOptions;
    private readonly validationRepository: ValidationRepository;

    constructor() {
        this.secretKey = process.env.JWT_SECRET_KEY;
        this.refreshKey = process.env.JWT_REFRESH_SECRET_KEY || "placeholder";
        this.options = {expiresIn: "24h"};
        this.validationRepository = new ValidationRepository();
    }

    async generateToken(
        validationKey: string,
        wynnGuildId: string
    ): Promise<TokenResponse> {
        if (validationKey === process.env.JWT_VALIDATION_KEY && wynnGuildId === "*") {
            return this.signJwtToken("to be implemented", "*");
        }

        const guild = await this.validationRepository.findOne({validationKey});

        this.validateGeneration(guild, wynnGuildId);

        return this.signJwtToken("to be implemented", wynnGuildId);
    }

    private validateGeneration(guild: IValidation | null, wynnGuildId: string): asserts guild is IValidation {
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

