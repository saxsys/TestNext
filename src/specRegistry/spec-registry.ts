import {SpecRegistryEntry} from "./specRegistryEntry/spec-registry-entry";
import {SpecRegistryError} from "./errors/errors";
var SPECCLASS_REGISTRY = new Map<string, SpecRegistryEntry>();

export class SpecRegistry {

  public static registerSpec(specClass: any, specName: string) {
    let specClassName = specClass.constructor.name;
    let registryEntry = SPECCLASS_REGISTRY.get(specClassName);
    if(registryEntry != null){
      if (registryEntry.getSpecName()!= null) {
        throw new SpecRegistryError(specClassName + ' is already registered for Spec:' + registryEntry.getSpecName() + ', can only be registered once, cannot register for Spec:' + specName, specClassName);
      }
        registryEntry.setSpecName(specName);
    } else {
      let entry = new SpecRegistryEntry(specClass);
      entry.setSpecName(specName);
      SPECCLASS_REGISTRY.set(specClassName, entry);
    }
  }

  public static registerGivenForSpec(specClass: any, functionName: string, description: string, execNumber?: number) {
    let specClassName = specClass.constructor.name;
    let specRegEntry = SPECCLASS_REGISTRY.get(specClassName);
    if(specRegEntry == null){
      specRegEntry = new SpecRegistryEntry(specClass);
      SPECCLASS_REGISTRY.set(specClassName, specRegEntry);
    } else {
      if(specRegEntry.getClass().constructor != specClass.constructor)
        throw new SpecRegistryError('SpecClass ' + specClassName + ' already exists, but is not same Class (for @Given ' + functionName + ')', specClassName, functionName);
    }

    let savedClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(savedClass, functionName);
    specRegEntry.addGiven(functionName, description, execNumber);
  }

  public static registerWhenForSpec(specClass: any, functionName: string, description: string) {
    let specClassName = specClass.constructor.name;
    let specRegEntry = SPECCLASS_REGISTRY.get(specClassName);
    if(specRegEntry == null){
      specRegEntry = new SpecRegistryEntry(specClass);
      SPECCLASS_REGISTRY.set(specClassName, specRegEntry);
    } else {
      if(specRegEntry.getClass().constructor != specClass.constructor)
        throw new SpecRegistryError('SpecClass ' + specClassName + ' already exists, but is not same Class (for @When ' + functionName + ')', specClassName, functionName);
    }

    let savedClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(savedClass, functionName);
    specRegEntry.addWhen(functionName, description);
  }

  public static registerThenForSpec(specClass: any, functionName: string, description: string, execNumber?: number) {
    let specClassName = specClass.constructor.name;
    let specRegEntry = SPECCLASS_REGISTRY.get(specClassName);
    if(specRegEntry == null){
      specRegEntry = new SpecRegistryEntry(specClass);
      SPECCLASS_REGISTRY.set(specClassName, specRegEntry);
    } else {
      if(specRegEntry.getClass().constructor != specClass.constructor)
        throw new SpecRegistryError('SpecClass ' + specClassName + ' already exists, but is not same Class (for @Then ' + functionName + ')', specClassName, functionName);
    }

    let savedClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(savedClass, functionName);
    specRegEntry.addThen(functionName, description, execNumber);
  }

  public static getSpecClassNames(): Array<String> {
    return Array.from(SPECCLASS_REGISTRY.keys());
  }

  public static getSpecByClassName(className: string): SpecRegistryEntry {
    return SPECCLASS_REGISTRY.get(className);
  }

  private static checkIfFunctionExistsOnClass(specClass: any, functionName: string){
    let className = specClass.constructor.name;
    if (specClass[functionName] == null) {
      throw new SpecRegistryError(className + '.' + functionName + ' does not exist.', className, functionName);
    }
    if (typeof specClass[functionName] != 'function') {
      throw new SpecRegistryError(className + '.' + functionName + ' is not a function.', className, functionName);
    }
  }

}
