import {SpecRegistry} from "../specRegistry";


export function Spec(testCaseName: string) {
  return (constructor: Function) => {
    let specClass = constructor.prototype;
    console.log(specClass);
    SpecRegistry.registerSpec(specClass, testCaseName);
  }
}

export function Given(description: string, execNumber?: number) {
  return (target: any, key: string, descriptor: any) => {
    SpecRegistry.registerGivenForSpec(target.name, key, description, execNumber);
  }
}

export function When(description: string) {
  return (target: any, key: string, descriptor: any) => {
    SpecRegistry.registerWhenForSpec(target.name, key, description);
  }
}

export function Then(description: string, execNumber?: number) {
  return (target: any, key: string, descriptor: any) => {
    SpecRegistry.registerThenForSpec(target.name, key, description, execNumber);
  }
}
