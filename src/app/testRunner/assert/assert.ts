export class Assert {
  private value;

  constructor(value: any) {
    this.value = value;
  }

  equals(comparator: any) {
    if (this.value !== comparator) {
      throw new Error('values are not equal');
    }
  }

  public static that(value) {
    return new Assert(value);
  }
}
