import {SpecRegistryEntry} from "./specRegistryEntry/spec-registry-entry";
var SPECCLASS_REGISTRY = new Map<string, SpecRegistryEntry>();

export class SpecRegistry {

  public static registerSpec(specClass: any, specName: string) {
    let specClassName = specClass.constructor.name;
    let registryEntry = SPECCLASS_REGISTRY.get(specClassName);
    if(registryEntry != null){
      if (registryEntry.getSpecName()!= null) {
        throw new Error(specClassName + ' is already registered for Spec:' + registryEntry.getSpecName() + ', can only be registered once, cannot register for Spec:' + specName);
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
        throw new Error('SpecClass ' + specClassName + ' already exists, but is not same Class (for @Given ' + functionName + ')');
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
        throw new Error('SpecClass ' + specClassName + ' already exists, but is not same Class (for @When ' + functionName + ')');
    }

    let savedClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(savedClass, functionName);
    specRegEntry.addWhen(functionName, description);
    /*
    let specRegEntry = SpecRegistry.getSpecBySpecClassNameException(specClassName);
    let specClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(specClass, functionName);
    specRegEntry.addWhen(functionName, description);
    */
  }

  public static registerThenForSpec(specClass: any, functionName: string, description: string, execNumber?: number) {
    let specClassName = specClass.constructor.name;
    let specRegEntry = SPECCLASS_REGISTRY.get(specClassName);
    if(specRegEntry == null){
      specRegEntry = new SpecRegistryEntry(specClass);
      SPECCLASS_REGISTRY.set(specClassName, specRegEntry);
    } else {
      if(specRegEntry.getClass().constructor != specClass.constructor)
        throw new Error('SpecClass ' + specClassName + ' already exists, but is not same Class (for @Then ' + functionName + ')');
    }

    let savedClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(savedClass, functionName);
    specRegEntry.addThen(functionName, description, execNumber);
  }
/*
  private static getSpecBySpecClassNameException(specClassName: string): SpecRegistryEntry {
    let specName = TESTCLASS_SPEC.get(specClassName);
    if (specName == null) throw new Error('Class ' + specClassName + ' is not registered as SpecRegistry');
    let specRegEntry = SPECCLASS_REGISTRY.get(specName);
    if (specRegEntry == null)throw new Error('There is no SpecRegEntry for SpecRegistry ' + specName + ', but Class ' + specClassName + 'is defined as SpecRegistry. This should not happen.');
    return specRegEntry
  }
*/
  public static getSpecClassNames(): Array<String> {
    return Array.from(SPECCLASS_REGISTRY.keys());
  }

  public static getSpecByClassName(className: string): SpecRegistryEntry {
    return SPECCLASS_REGISTRY.get(className);
  }

  private static checkIfFunctionExistsOnClass(specClass: any, functionName: string){
    if (specClass[functionName] == null) {
      throw new Error(specClass.constructor.name + '.' + functionName + ' does not exist.');
    }
    if (typeof specClass[functionName] != 'function') {
      throw new Error(specClass.constructor.name + '.' + functionName + ' is not a function.');
    }
  }

}
