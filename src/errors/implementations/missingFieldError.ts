import { ValidationError } from "./validationError";

export class MissingFieldError extends ValidationError {
    constructor(name: string, type: string) {
        super(getMissingFieldMessage(name, type));
    }
}

export function getMissingFieldMessage(name: string, type: string) {
    return `Missing request body element ${name} with type ${type}.`;
}
