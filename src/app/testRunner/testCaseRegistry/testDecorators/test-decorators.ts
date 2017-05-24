import {TestCaseRegistry} from "../testCaseRegistry";


export function Spec(description: string) {
  return (constructor: Function) => {
    let testClass = {};
    constructor.call(testClass);
    TestCaseRegistry.registerTestCase(testClass, description);
  }
}

export function Given(description: string, execNumber: number) {
  return (target: any, key: string, descriptor: any) => {
    TestCaseRegistry.registerGivenForTestCase(target.name, key, description, execNumber);
    // TODO implement given
  }
}

export function When(description: string) {
  return (target: any, key: string, descriptor: any) => {
    TestCaseRegistry.registerWhenForTestCase(target.name, key, description);
  }
  // TODO implement when
}

export function Then(description: string, execNumber: number) {
  return (target: any, key: string, descriptor: any) => {
    TestCaseRegistry.registerThenForTestCase(target.name, key, description, execNumber);
  }
  // TODO implement then
}
