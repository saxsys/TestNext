import {TestCaseRegistryEntry} from "./testCaseRegistryEntry/testCase-registry-entry";
var TESTCASE_REGISTRY = new Map<string, TestCaseRegistryEntry>();

export  class TestCaseRegistry{

  public static registerTestCase(testClass:any, description:string) {
    let entry = new TestCaseRegistryEntry(testClass, description);
    if (TESTCASE_REGISTRY.get(entry.getDescription()) != null)
      throw new Error('Test Case with same name already exists');
    TESTCASE_REGISTRY.set(entry.getDescription(), entry);
  }

  public static registerGivenForTestCase(testCaseName: string, givenFunctionName: string, description:string, execNumber?:number){
    // TODO implement registerGivenForTestCase
    throw new Error('not implemented');
  }

  public static registerWhenForTestCase(testCaseName: string, whenFunctionName: string, description:string){
    // TODO implement registerGivenForTestCase
    throw new Error('not implemented');
  }

  public static registerThenForTestCase(testCaseName: string, thenFunctionName: string, description:string, execNumber?:number){
    // TODO implement registerGivenForTestCase
    throw new Error('not implemented');
  }

  public static getTestCaseNames(): Array<String>{
    return Array.from(TESTCASE_REGISTRY.keys());
  }
  public getTestcaseByName(name: string): TestCaseRegistryEntry{
    return TESTCASE_REGISTRY.get(name);
  }

}
