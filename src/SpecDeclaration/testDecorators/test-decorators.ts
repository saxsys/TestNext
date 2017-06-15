import {specRegistry} from "../../SpecStorage/specRegistry/spec-registry-storage";
import {Provider} from "@angular/core";


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

export function SUT(provider:Provider){
  return (constructor: Function) => {
    specRegistry.registerSutForSpec(constructor, provider);
  }
}

export function Providers(providers:Provider[]){
  return (constructor: Function) => {
    specRegistry.registerProvidersForSpec(constructor, providers);
  }
}

