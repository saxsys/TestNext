import {TestValidator} from './testValidator/test-validator';

export abstract class TestRunner {
  public runTest(testObject: any) {
    TestValidator.validateTest(testObject);

  }

  private getAllTestcases(): Array<String> {
    const testcases = new Array<String>();
    //TODO getTestcases

    return testcases;

  }


}
