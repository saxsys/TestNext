import {specRegistry} from "../specRegistry/spec-registry-storage";
import {SpecRegistryError} from "../specRegistry/errors/errors";
import construct = Reflect.construct;


export function Spec(testCaseName: string) {
  return (constructor: Function) => {
    let specClass = constructor;
    if(constructor.length > 0)
      throw new SpecRegistryError(
        'SpecClass "' + constructor.name +'" has constructor-arguments, this is forbidden in Spec-classes',
        constructor.name, 'constructor'
      );

    specRegistry.registerSpec(specClass, testCaseName);
  }
}

export function Given(description: string, execNumber?: number) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    let className = constructor.name;
    if(constructor.length > 0)
      throw new SpecRegistryError(
        'SpecClass "' + className + '" has constructor-arguments, this is forbidden in Spec-classes', className, key
      );


    specRegistry.registerGivenForSpec(constructor, key, description, execNumber);
  }
}

export function When(description: string) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    let className = constructor.name;
    if(constructor.length > 0)
      throw new SpecRegistryError(
        'SpecClass "' + className +'" has constructor-arguments, this is forbidden in Spec-classes',
        className, key
      );

    specRegistry.registerWhenForSpec(constructor, key, description);
  }
}

export function Then(description: string, execNumber?: number) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    let className = constructor.name;
    if(constructor.length > 0)
      throw new SpecRegistryError(
        'SpecClass "' + className +'" has constructor-arguments, this is forbidden in Spec-classes',
        className, key
      );

    specRegistry.registerThenForSpec(constructor, key, description, execNumber);
  }
}

export function Subject(description: string) {
  return (constructor: Function) => {

    if(constructor.length > 0)
      throw new SpecRegistryError(
        'SpecClass "' + constructor.name +'" has constructor-arguments, this is forbidden in Spec-classes',
        constructor.name, 'constructor'
      );

    specRegistry.registerSpecForSubject(constructor, description);
  }
}
