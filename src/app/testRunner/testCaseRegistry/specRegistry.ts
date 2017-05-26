import {SpecRegistryEntry} from "./specRegistryEntry/spec-registry-entry";
var SPEC_REGISTRY = new Map<string, SpecRegistryEntry>();
var TESTCLASS_SPEC = new Map<string, string>();

export class SpecRegistry {

  public static registerSpec(specClass: any, specName: string) {
    let specClassName = specClass.constructor.name;
    let existingSpecName = TESTCLASS_SPEC.get(specClassName);
    if (existingSpecName != null)
      throw new Error(specClassName + ' is already registered for Spec:' + existingSpecName +  ', can only be registered once, cannot register for Spec:' + specName);
    if (SPEC_REGISTRY.get(specName) != null)
      throw new Error('SpecRegistry with same name already exists ' + specName + ' (Class: ' + specClassName + ')');
    let entry = new SpecRegistryEntry(specClass, specName);
    SPEC_REGISTRY.set(specName, entry);
    TESTCLASS_SPEC.set(specClass.constructor.name, specName)
  }

  public static registerGivenForSpec(specClassName: string, functionName: string, description: string, execNumber?: number) {
    let specRegEntry = SpecRegistry.getSpecBySpecClassNameException(specClassName);
    let specClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(specClass, functionName);
    specRegEntry.addGiven(functionName, description, execNumber);
  }

  public static registerWhenForSpec(specClassName: string, functionName: string, description: string) {
    let specRegEntry = SpecRegistry.getSpecBySpecClassNameException(specClassName);
    let specClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(specClass, functionName);
    specRegEntry.addWhen(functionName, description);
  }

  public static registerThenForSpec(specClassName: string, FunctionName: string, description: string, execNumber?: number) {
    let specRegEntry = SpecRegistry.getSpecBySpecClassNameException(specClassName);
    let specClass = specRegEntry.getClass();
    SpecRegistry.checkIfFunctionExistsOnClass(specClass, FunctionName);
    specRegEntry.addThen(FunctionName, description, execNumber);
  }

  private static getSpecBySpecClassNameException(specClassName: string): SpecRegistryEntry {
    let specName = TESTCLASS_SPEC.get(specClassName);
    if (specName == null) throw new Error('Class ' + specClassName + ' is not registered as SpecRegistry');
    let specRegEntry = SPEC_REGISTRY.get(specName);
    if (specRegEntry == null)throw new Error('There is no SpecRegEntry for SpecRegistry ' + specName + ', but Class ' + specClassName + 'is defined as SpecRegistry. This should not happen.');
    return specRegEntry
  }

  public static getSpecNames(): Array<String> {
    return Array.from(SPEC_REGISTRY.keys());
  }

  public static getSpecClassNames(): Array<String>{
    return Array.from(TESTCLASS_SPEC.keys());
  }

  public static getSpecByName(specName: string): SpecRegistryEntry {
    return SPEC_REGISTRY.get(specName);
  }

  public getSpecByClassName(specClassName:string){
    let specName = TESTCLASS_SPEC.get(specClassName);
    if (specName == null) return null;
    let specRegEntry = SPEC_REGISTRY.get(specName);
    return specRegEntry

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
