import { Err } from './error';

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
// ESLint complains about the class not correctly implementing the static methods from
// Result, which is not an issue, as it should only be used for generic types.
export class GenericResult<TValue> extends Result {
  private readonly value?: TValue | null;

  public constructor(error: Err, value?: TValue | null) {
    super(error);
    this.value = value;
  }

  public getValue(): TValue {
    if (this.isFailure) {
      throw new Error('The value of a failure cannot be accessed.');
    }

    return this.value!;
  }

  public static success<TValue>(value: TValue): GenericResult<TValue> {
    return new GenericResult(Err.None, value);
  }

  public static failure<TValue>(error: Err): GenericResult<TValue> {
    return new GenericResult<TValue>(error);
  }

  public static from<TValue>(value?: TValue | null): GenericResult<TValue> {
    return value !== null
      ? this.success(value!)
      : this.failure(Err.ConditionNotMet);
  }
}
