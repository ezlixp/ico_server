import jwt, { JwtPayload } from "jsonwebtoken";
import "../config.js";
import { TokenResponse } from "../communication/responses/tokenResponse.js";
import { TokenError } from "../errors/implementations/tokenError.js";
import { getPlayersGuildAsync, IWynnGuild } from "../communication/httpClients/wynncraftApiClient.js";
import { UserRepository } from "../repositories/userRepository.js";
import { ValidationError } from "../errors/implementations/validationError.js";

export class JwtTokenHandler {
    private readonly secretKey: string;
    private readonly refreshKey: string;
    private readonly options: jwt.SignOptions;
    private readonly refreshValidationRepository: UserRepository;

    private constructor() {
        this.secretKey = process.env.JWT_SECRET_KEY;
        this.refreshKey = process.env.JWT_REFRESH_SECRET_KEY;
        this.options = { expiresIn: "24h" };
        this.refreshValidationRepository = new UserRepository();
    }

    static create() {
        return new JwtTokenHandler();
    }

    async generateAdminToken() {
        return this.signJwtToken("!bot", "*");
    }

    async refreshToken(refreshToken: string): Promise<TokenResponse> {
        return new Promise<TokenResponse>((resolve, reject) => {
            jwt.verify(refreshToken, this.refreshKey, async (err, payload) => {
                if (err) throw new ValidationError("Invalid refresh token.");

                const p = payload! as JwtPayload;
                if (!p.discordUuid) throw new ValidationError("Invalid refresh token.");

                const user = await this.refreshValidationRepository.findOne({ discordUuid: p.discordUuid });
                if (!user) throw new ValidationError("Invalid refresh token.");

                if (user.refreshToken !== refreshToken) {
                    throw new ValidationError("Invalid refresh token.");
                }

                resolve(await this.generateToken(user.discordUuid, await getPlayersGuildAsync(user.mcUuid)));
            });
        });
    }

    async generateToken(discordUuid: string, wynnGuildId: IWynnGuild | null): Promise<TokenResponse> {
        this.validateGeneration(wynnGuildId);

        return this.signJwtToken(discordUuid, wynnGuildId.uuid);
    }

    private validateGeneration(wynnGuildId: IWynnGuild | null): asserts wynnGuildId is IWynnGuild {
        if (!wynnGuildId) throw new TokenError();
    }

    private signJwtToken(discordUuid: string, guildId: string): TokenResponse {
        let response: TokenResponse;

        const jwtToken = jwt.sign({ discordUuid: discordUuid, guildId: guildId }, this.secretKey, this.options);
        const refreshToken = jwt.sign({ discordUuid: discordUuid }, this.refreshKey, {
            expiresIn: "7d",
        });

        response = new TokenResponse(jwtToken, refreshToken);
        return response;
    }
}
