
enum Needs {
  must,
  optional,
  forbidden
}

export class TestValidator {
  public static validateTest(test: any): boolean {

    for (const expProp of TestValidator.expectedProperties) {
      if (expProp.need === Needs.must) {
        if (test[expProp.property] == null) {
          return false;
        }
      } else if (expProp.need === Needs.forbidden) {
        if (test[expProp.property] != null) {
          return false;
        }
      }
    }

    return true;
  };

  private static expectedProperties = [
    {
      property: 'name',
      type: 'string',
      need: Needs.must
    }
  ];

}


