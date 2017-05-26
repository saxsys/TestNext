
enum Needs {
  must,
  optional,
  forbidden
}

export class TestValidator {
  public static validateTest(test: any): boolean {
    throw new Error('Not implemented yet: TestValidator.validateTest')
  };

  private static expectedProperties = [
    /*
    {
      property: 'name',
      type: 'string',
      need: Needs.must
    }
    */
  ];

}


