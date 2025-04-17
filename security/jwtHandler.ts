import jwt from "jsonwebtoken";
import "../config.js";
import { TokenResponse } from "../communication/responses/tokenResponse.js";
import { TokenError } from "../errors/implementations/tokenError.js";
import { GuildRepository } from "../repositories/guildRepository.js";
import { IWynnGuild } from "../communication/httpClients/wynncraftApiClient.js";

export class JwtTokenHandler {
    private readonly secretKey: string;
    private readonly refreshKey: string;
    private readonly options: jwt.SignOptions;
    private readonly validationRepository: GuildRepository;

    private constructor() {
        this.secretKey = process.env.JWT_SECRET_KEY;
        this.refreshKey = process.env.JWT_REFRESH_SECRET_KEY;
        this.options = { expiresIn: "24h" };
        this.validationRepository = new GuildRepository();
    }

    static create() {
        return new JwtTokenHandler();
    }

    async generateAdminToken() {
        return this.signJwtToken("!bot", "*");
    }

    async generateToken(discordUuid: string, wynnGuildId: IWynnGuild | null): Promise<TokenResponse> {
        this.validateGeneration(wynnGuildId);

        return this.signJwtToken(discordUuid, wynnGuildId.uuid);
    }

    private validateGeneration(wynnGuildId: IWynnGuild | null): asserts wynnGuildId is IWynnGuild {
        if (!wynnGuildId) throw new TokenError();
    }

    private signJwtToken(username: string, guildId: string): TokenResponse {
        let response: TokenResponse;

        const jwtToken = jwt.sign({ username: username, guildId: guildId }, this.secretKey, this.options);
        const refreshToken = jwt.sign({ username: username, guildId: guildId }, this.refreshKey, {
            expiresIn: "7d",
        });

        response = new TokenResponse(jwtToken, refreshToken);
        return response;
    }
}
