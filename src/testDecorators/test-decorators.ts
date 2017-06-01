import {SpecRegistry} from "../specRegistry/spec-registry";
import {SpecRegistryError} from "../specRegistry/errors/errors";


export function Spec(testCaseName: string) {
  return (constructor: Function) => {
    let specClass = new constructor.prototype.constructor;
    if(constructor.length > 0)
      throw new SpecRegistryError('SpecClass ' + specClass.constructor.name +' has constructor-arguments, this is forbidden in Spec-classes', specClass.constructor.name, 'constructor');

    SpecRegistry.registerSpec(specClass, testCaseName);
  }
}

export function Given(description: string, execNumber?: number) {
  return (target: any, key: string, descriptor: any) => {

    let className = target.constructor.name;
    if(target.constructor.length > 0)
      throw new SpecRegistryError('SpecClass ' + className + ' has constructor-arguments, this is forbidden in Spec-classes', className, key);

    let specClass = new target.constructor;
    if(specClass[key].length > 0)
      throw new SpecRegistryError('@Given-method ' + className + '.' + key + ' has arguments, this is forbidden for @Given-methods', className, key);

    SpecRegistry.registerGivenForSpec(specClass, key, description, execNumber);
  }
}

export function When(description: string) {
  return (target: any, key: string, descriptor: any) => {

    let className = target.constructor.name;
    if(target.constructor.length > 0)
      throw new SpecRegistryError('SpecClass ' + className +' has constructor-arguments, this is forbidden in Spec-classes', className, key);

    let specClass = new target.constructor;
    if(specClass[key].length > 0)
      throw new SpecRegistryError('@When-method ' + className + '.' + key + ' has arguments, this is forbidden for @When-methods', className, key);

    SpecRegistry.registerWhenForSpec(specClass, key, description);
  }
}

export function Then(description: string, execNumber?: number) {
  return (target: any, key: string, descriptor: any) => {

    let className = target.constructor.name;
    if(target.constructor.length > 0)
      throw new SpecRegistryError('SpecClass ' + className +' has constructor-arguments, this is forbidden in Spec-classes', className, key);

    let specClass = new target.constructor;
    if(specClass[key].length > 0)
      throw new SpecRegistryError('@Then-method ' + className + '.' + key + ' has arguments, this is forbidden for @Then-methods', className, key);

    SpecRegistry.registerThenForSpec(specClass, key, description, execNumber);
  }
}
