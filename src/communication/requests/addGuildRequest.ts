export class AddGuildRequest {
    validationKey: string;
    wynnGuildId: string;
    wynnGuildName: string;

    private constructor(validationKey: string, wynnGuildId: string, wynnGuildName: string) {
        this.validationKey = validationKey;
        this.wynnGuildId = wynnGuildId;
        this.wynnGuildName = wynnGuildName;
    }

    static create(validationKey: string, wynnGuildId: string, wynnGuildName: string) {
        return new AddGuildRequest(validationKey, wynnGuildId, wynnGuildName);
    }
}
