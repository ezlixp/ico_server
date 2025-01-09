import {BaseRepository} from "./base/baseRepository.js";
import ValidationModel, {IValidation} from "../models/validationModel.js";

export class ValidationRepository extends BaseRepository<IValidation> {
    constructor() {
        super(ValidationModel);
    }
}