


import {Spec} from "./testDecorators/test-decorators";
import {TestCaseRegistry} from "./testCaseRegistry";
describe('TestCaseRegistry.registerTestCase', () => {

  let testCaseName = 'exampleTestCase';
  beforeAll(() => {

    @Spec(testCaseName)
    class ExampleTestCase{
      private num = 9;
    }
  });

  it('should be added a testCase', () => {

    let includedTestCases = TestCaseRegistry.getTestCaseNames().indexOf('exampleTestCase');
    expect(includedTestCases).toBeGreaterThanOrEqual(0)
    console.log(includedTestCases[0]);
  });

  it('should be correct testCase-Entries', () => {
    fail('test not implemented, continue here');
  })
});
