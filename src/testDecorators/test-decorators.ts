import {specRegistry} from "../specRegistry/spec-registry-storage";


export function Spec(testCaseName: string) {
  return (constructor: Function) => {
    let specClass = constructor;
    specRegistry.registerSpec(specClass, testCaseName);
  }
}

export function Given(description: string, execNumber?: number) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerGivenForSpec(constructor, key, description, execNumber);
  }
}

export function When(description: string) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerWhenForSpec(constructor, key, description);
  }
}

export function Then(description: string, execNumber?: number) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerThenForSpec(constructor, key, description, execNumber);
  }
}

export function Subject(description: string) {
  return (constructor: Function) => {

    specRegistry.registerSpecForSubject(constructor, description);
  }
}

export function Ignore(reason: string) {
  return (constructor: Function) => {
    specRegistry.registerSpecAsIgnored(constructor, reason);
  }
}
