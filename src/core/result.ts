import { Err } from './error';
import { Request } from 'express';

export class Result {
  public error: Err;
  public isSuccess: boolean;
  public isFailure: boolean;

  protected constructor(error: Err) {
    this.error = error;
    this.isSuccess = error === Err.None;
    this.isFailure = !this.isSuccess;
  }

  public static success(): Result {
    return new Result(Err.None);
  }

  public static failure(error: Err): Result {
    return new Result(error);
  }

  public static from(condition: boolean): Result {
    return condition ? Result.success() : Result.failure(Err.ConditionNotMet);
  }
}

export class GenericResult<TValue> extends Result {
  private readonly value?: TValue;

  public constructor(error: Err, value?: TValue) {
    super(error);
    this.value = value;
  }

  public getValue(): TValue {
    if (this.isFailure) {
      throw new Error('The value of a failure cannot be accessed.');
    }

    return this.value!;
  }
}
