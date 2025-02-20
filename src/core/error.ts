export class Err {
  static None = new Err('');
  static NullArgument = new Err('The specified value is null.');
  static ConditionNotMet = new Err('The specified condition was not met.');

  protected constructor(public errorMessage: string) {}
}
