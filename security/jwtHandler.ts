import jwt, { JwtPayload } from "jsonwebtoken";
import "../config.js";
import { TokenResponse } from "../communication/responses/tokenResponse.js";
import { TokenError } from "../errors/implementations/tokenError.js";
import { getUuidGuildAsync, IWynnGuild } from "../communication/httpClients/wynncraftApiClient.js";
import { ValidationError } from "../errors/implementations/validationError.js";
import { UserErrors } from "../errors/messages/userErrors.js";
import { HydratedDocument } from "mongoose";
import { IUser } from "../models/entities/userModel.js";
import { TokenErrors } from "../errors/messages/tokenErrors.js";
import Repositories from "../repositories/repositories.js";

export class JwtTokenHandler {
    private readonly secretKey: string;
    private readonly refreshKey: string;
    private readonly options: jwt.SignOptions;

    private constructor() {
        this.secretKey = process.env.JWT_SECRET_KEY;
        this.refreshKey = process.env.JWT_REFRESH_SECRET_KEY;
        this.options = { expiresIn: "15m" };
    }

    static create() {
        return new JwtTokenHandler();
    }

    async generateAdminToken() {
        return this.signJwtToken("!bot", "*");
    }

    async refreshToken(refreshToken: string): Promise<TokenResponse> {
        let payload;
        try {
            payload = jwt.verify(refreshToken, this.refreshKey);
        } catch (err) {
            throw new ValidationError(TokenErrors.INVALID_REFRESH);
        }

        const p = payload! as JwtPayload;
        if (!p.discordUuid) throw new ValidationError(TokenErrors.INVALID_REFRESH);

        if (p.discordUuid === "!bot" && p.guildUuid === "*") {
            return await this.generateAdminToken();
        }

        const user = await Repositories.user.findOne({ discordUuid: p.discordUuid });
        if (!user) throw new ValidationError(TokenErrors.INVALID_REFRESH);

        if (user.refreshToken !== refreshToken) {
            throw new ValidationError(TokenErrors.INVALID_REFRESH);
        }

        return await this.generateToken(user.discordUuid, await getUuidGuildAsync(user.mcUuid));
    }

    async generateToken(discordUuid: string, wynnGuildId: IWynnGuild | null, mcUuid?: string): Promise<TokenResponse> {
        const user = await Repositories.user.findOne({ discordUuid: discordUuid });

        this.validateGuild(wynnGuildId);
        this.validateAccount(user, mcUuid);
        const tokenRes = this.signJwtToken(discordUuid, wynnGuildId.uuid);
        user.refreshToken = tokenRes.refreshToken!;
        user.save();
        return tokenRes;
    }

    private validateGuild(wynnGuildId: IWynnGuild | null): asserts wynnGuildId is IWynnGuild {
        if (!wynnGuildId) throw new TokenError();
    }
    private validateAccount(
        user: HydratedDocument<IUser> | null,
        mcUuid?: string
    ): asserts user is HydratedDocument<IUser> {
        if (!user) throw new ValidationError(UserErrors.NOT_FOUND);
        if (user.banned) throw new ValidationError(UserErrors.BANNED);
        if (mcUuid && mcUuid !== user.mcUuid) throw new ValidationError(UserErrors.NOT_LINKED);
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
