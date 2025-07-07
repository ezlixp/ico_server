import { ServerRepository } from "../repositories/serverRepository.js";

export class ServerService {
    private readonly validator: ServerServiceValidator;
    private readonly repository: ServerRepository;

    private constructor() {
        this.validator = new ServerServiceValidator();
        this.repository = new ServerRepository();
    }
}

class ServerServiceValidator {}
