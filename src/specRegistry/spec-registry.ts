import {SpecRegistryEntry} from "./specRegistryEntry/spec-registry-entry";
import {SpecRegistryError} from "./errors/errors";
import {ISpecExecutable} from "./specRegistryEntry/ISpec";
let SPECCLASS_REGISTRY = new Map<string, SpecRegistryEntry>();
let SUBJECT_SPECCLASSNAMES = new Map<string, Array<string>>();

export class SpecRegistry {

  public static registerSpec(specClass: any, specName: string) {
    let specClassName = specClass.constructor.name;
    let registryEntry = SPECCLASS_REGISTRY.get(specClassName);
    if(registryEntry != null){
      if (registryEntry.getSpecName()!= null) {
        throw new SpecRegistryError(specClassName + ' is already registered for Spec:' + registryEntry.getSpecName() + ', can only be registered once, cannot register for Spec:' + specName, specClassName);
      }
        registryEntry.setDescription(specName);
    } else {
      let entry = new SpecRegistryEntry(specClass);
      entry.setDescription(specName);
      SPECCLASS_REGISTRY.set(specClassName, entry);
    }
  }

  public static registerSpecForSubject(specClass:any , subject:string ){
    let specClassName = specClass.constructor.name;

    //write subject into Spec
    let specRegEntry = SpecRegistry.getOrRegisterSpecClass(specClass);
    specRegEntry.addSubject(subject);

    //write Spec into Subject List
    let subjClasses = SUBJECT_SPECCLASSNAMES.get(subject);
    if(subjClasses == null){
      subjClasses = new Array<string>();
      SUBJECT_SPECCLASSNAMES.set(subject, subjClasses);
    } else if(subjClasses.includes(specClassName)){
        return;
    }
    subjClasses.push(specClassName);
  }

  public static registerGivenForSpec(specClass: any, functionName: string, description: string, execNumber?: number) {

    let specRegEntry = SpecRegistry.getOrRegisterSpecClass(specClass);
    SpecRegistry.checkIfFunctionExistsOnClass(specRegEntry.getClass(), functionName);
    specRegEntry.addGiven(functionName, description, execNumber);
  }

  public static registerWhenForSpec(specClass: any, functionName: string, description: string) {
    let specRegEntry = SpecRegistry.getOrRegisterSpecClass(specClass);
    SpecRegistry.checkIfFunctionExistsOnClass(specRegEntry.getClass(), functionName);
    specRegEntry.addWhen(functionName, description);
  }

  public static registerThenForSpec(specClass: any, functionName: string, description: string, execNumber?: number) {
    let specRegEntry = SpecRegistry.getOrRegisterSpecClass(specClass);
    SpecRegistry.checkIfFunctionExistsOnClass(specRegEntry.getClass(), functionName);
    specRegEntry.addThen(functionName, description, execNumber);
  }

  public static getSpecClassNames(): Array<String> {
    return Array.from(SPECCLASS_REGISTRY.keys());
  }

  public static getSpecByClassName(className: string): SpecRegistryEntry {
    return SPECCLASS_REGISTRY.get(className);
  }

  public static getRegistryEntries(): Array<ISpecExecutable>{
    return Array.from(SPECCLASS_REGISTRY.values());
  }

  public static getSpecsForSubject(subject:string):Array<SpecRegistryEntry>{
    let specs = new Array<SpecRegistryEntry>();
    let classNames = SUBJECT_SPECCLASSNAMES.get(subject);

    if(classNames == null)
      return specs;

    classNames.forEach((className) => {
      specs.push(SpecRegistry.getSpecByClassName(className));
    });

    return specs;

  }

  private static getOrRegisterSpecClass(specClass): SpecRegistryEntry{
    let specClassName = specClass.constructor.name;

    let specRegEntry = SPECCLASS_REGISTRY.get(specClassName);
    if(specRegEntry == null) {
      specRegEntry = new SpecRegistryEntry(specClass);
      SPECCLASS_REGISTRY.set(specClassName, specRegEntry);
    } else {
      if(specRegEntry.getClass().constructor != specClass.constructor){
        throw new SpecRegistryError('SpecClass "' + specClassName + '" appears at least twice with the same Name, but different Implementations, this is forbidden', specClassName);
      }
    }
    return specRegEntry;
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
