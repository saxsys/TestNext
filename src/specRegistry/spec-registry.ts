import {SpecRegistryEntry} from "./specRegistryEntry/spec-registry-entry";
import {SpecRegistryError} from "./errors/errors";
import {ISpecExecutable} from "./specRegistryEntry/ISpec";
import * as _ from "underscore";

export class SpecRegistry {

  private specClasses = new Map<string, SpecRegistryEntry>();
  private subject_specNames = new Map<string, Array<string>>();


  public registerSpec(specClassConstructor: Function, specName: string) {
    let specClassName = specClassConstructor.name;

    let registryEntry = this.getOrRegisterSpecClass(specClassConstructor);

    if (registryEntry.getSpecName()!= null)
      throw new SpecRegistryError('SpecClass "' + specClassName + '" already got has Description: "' + registryEntry.getSpecName() + '", only one is possible, cannot add: "' + specName + '"', specClassName);

    registryEntry.setDescription(specName);

  }

  public registerSpecForSubject(specClassConstructor:Function , subject:string ){
    let specClassName = specClassConstructor.name;

    //write subject into Spec
    let specRegEntry = this.getOrRegisterSpecClass(specClassConstructor);
    specRegEntry.addSubject(subject);

    //write Spec into Subject List
    let subjClasses = this.subject_specNames.get(subject);
    if(subjClasses == null){
      subjClasses = [];
      this.subject_specNames.set(subject, subjClasses);
    } else if(subjClasses.includes(specClassName)){
        return;
    }
    subjClasses.push(specClassName);
  }

  public registerGivenForSpec(specClassConstructor: Function, functionName: string, description: string, execNumber?: number) {

    let specRegEntry = this.getOrRegisterSpecClass(specClassConstructor);
    specRegEntry.addGiven(functionName, description, execNumber);
  }

  public registerWhenForSpec(specClass: Function, functionName: string, description: string) {
    let specRegEntry = this.getOrRegisterSpecClass(specClass);
    specRegEntry.addWhen(functionName, description);
  }

  public registerThenForSpec(specClass: Function, functionName: string, description: string, execNumber?: number) {
    let specRegEntry = this.getOrRegisterSpecClass(specClass);
    specRegEntry.addThen(functionName, description, execNumber);
  }



  public getSpecClassNames(): Array<String> {
    return Array.from(this.specClasses.keys());
  }

  public getSubjects():Array<string>{
    return Array.from(this.subject_specNames.keys());
  }

  public getSpecByClassName(className: string): SpecRegistryEntry {
    return this.specClasses.get(className);
  }

  public getRegistryEntries(): Array<ISpecExecutable>{
    return Array.from(this.specClasses.values());
  }

  public getSpecsForSubject(subject:string):Array<SpecRegistryEntry>{
    let specs = new Array<SpecRegistryEntry>();
    let classNames = this.subject_specNames.get(subject);

    if(classNames == null)
      return specs;

    classNames.forEach((className) => {
      specs.push(this.getSpecByClassName(className));
    });

    return specs;

  }

  public getSpecsWithoutSubject():Array<SpecRegistryEntry>{
    let allRemainingSpecNames = Array.from(this.specClasses.keys());

    this.subject_specNames.forEach((specs) => {
      allRemainingSpecNames = _.difference(allRemainingSpecNames, specs);
    });

    let specsWithoutSubject = new Array<SpecRegistryEntry>();
    allRemainingSpecNames.forEach((specName) => {
      specsWithoutSubject.push(this.specClasses.get(specName));
    });
    return specsWithoutSubject;
  }

  private getOrRegisterSpecClass(specClassConstructor:Function): SpecRegistryEntry{
    let specClassName = specClassConstructor.name;

    let specRegEntry = this.specClasses.get(specClassName);
    if(specRegEntry == null) {
      specRegEntry = new SpecRegistryEntry(specClassConstructor);
      this.specClasses.set(specClassName, specRegEntry);
    } else {
      if(specRegEntry.getClassConstructor() != specClassConstructor){
        throw new SpecRegistryError('A different Class with the Name "' + specClassName + '" is already registered, class-name-duplicates are forbidden', specClassName);
      }
    }
    return specRegEntry;
  }
}
