import {SpecRegistry} from "../specRegistry";


export function Spec(testCaseName: string) {
  return (constructor: Function) => {
    let specClass = constructor.prototype;
    SpecRegistry.registerSpec(specClass, testCaseName);
  }
}

export function Given(description: string, execNumber?: number) {
  return (target: any, key: string, descriptor: any) => {
    let specClass = new target.constructor;
    SpecRegistry.registerGivenForSpec(specClass, key, description, execNumber);
  }
}

export function When(description: string) {
  return (target: any, key: string, descriptor: any) => {
    let specClass = new target.constructor;
    SpecRegistry.registerWhenForSpec(specClass, key, description);
  }
}

export function Then(description: string, execNumber?: number) {
  return (target: any, key: string, descriptor: any) => {
    let specClass = new target.constructor;
    SpecRegistry.registerThenForSpec(specClass, key, description, execNumber);
  }
}
