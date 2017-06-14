import {Spec} from "../spec/spec";
import {SpecRegistryError} from "./errors/errors";
import {ISpec} from "../spec/ISpec";
import * as _ from "underscore";

export class SpecRegistry {

  private specClasses = new Map<string, Spec>();
  private subject_specNames = new Map<string, Array<string>>();


  registerSpec(specClassConstructor: Function, specName: string) {
    let specClassName = specClassConstructor.name;

    let registryEntry = this.getOrRegisterSpecClass(specClassConstructor);

    if (registryEntry.getSpecName()!= null)
      throw new SpecRegistryError('Spec "' + specClassName + '" already got has Description: "' + registryEntry.getSpecName() + '", only one is possible, cannot add: "' + specName + '"', specClassName);

    registryEntry.setDescription(specName);

  }

  registerGivenForSpec(specClassConstructor: Function, functionName: string, description: string, execNumber?: number) {

    let specRegEntry = this.getOrRegisterSpecClass(specClassConstructor);
    specRegEntry.addGiven(functionName, description, execNumber);
  }

  registerWhenForSpec(specClass: Function, functionName: string, description: string) {
    let specRegEntry = this.getOrRegisterSpecClass(specClass);
    specRegEntry.addWhen(functionName, description);
  }

  registerThenForSpec(specClass: Function, functionName: string, description: string, execNumber?: number) {
    let specRegEntry = this.getOrRegisterSpecClass(specClass);
    specRegEntry.addThen(functionName, description, execNumber);
  }

  registerSpecForSubject(specClassConstructor:Function , subject:string ){
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

  registerSpecAsIgnored(specClassConstructor:Function, reason:string){
    let spec = this.getOrRegisterSpecClass(specClassConstructor);
    spec.setIgnored(reason);
  }


  getSpecClassNames(): Array<String> {
    return Array.from(this.specClasses.keys());
  }

  getSubjects():Array<string>{
    return Array.from(this.subject_specNames.keys());
  }

  getSpecByClassName(className: string): Spec {
    return this.specClasses.get(className);
  }

  getAllSpecs(): Array<ISpec>{
    return Array.from(this.specClasses.values());
  }

  getSpecsForSubject(subject:string):Array<Spec>{
    let specs = new Array<Spec>();
    let classNames = this.subject_specNames.get(subject);

    if(classNames == null)
      return specs;

    classNames.forEach((className) => {
      specs.push(this.getSpecByClassName(className));
    });

    return specs;

  }

  getSpecsWithoutSubject():Array<Spec>{
    let allRemainingSpecNames = Array.from(this.specClasses.keys());

    this.subject_specNames.forEach((specs) => {
      allRemainingSpecNames = _.difference(allRemainingSpecNames, specs);
    });

    let specsWithoutSubject = new Array<Spec>();
    allRemainingSpecNames.forEach((specName) => {
      specsWithoutSubject.push(this.specClasses.get(specName));
    });
    return specsWithoutSubject;
  }

  getExecutableSpecs():Array<ISpec>{
    let executableSpecs = new Array<ISpec>();
    Array.from(this.specClasses.values()).forEach((spec) => {
      if(spec.isExecutableSpec())
        executableSpecs.push(spec);
    });
    return executableSpecs;
  }

  private getOrRegisterSpecClass(specClassConstructor:Function): Spec{
    let specClassName = specClassConstructor.name;

    let specRegEntry = this.specClasses.get(specClassName);
    if(specRegEntry == null) {

      //getParentSpec, if existing
      // TODO check if there is a better way to get Parent-Class Name
      let parentSpec = null;
      let prototype = specClassConstructor.prototype;
      if(prototype.__proto__.constructor.name != 'Object') {
        parentSpec = this.getOrRegisterSpecClass(prototype.__proto__.constructor);
      }

      specRegEntry = new Spec(specClassConstructor, parentSpec);
      this.specClasses.set(specClassName, specRegEntry);
    } else {
      if(specRegEntry.getClassConstructor() != specClassConstructor){
        throw new SpecRegistryError('A different Class with the Name "' + specClassName + '" is already registered, class-name-duplicates are forbidden', specClassName);
      }
    }
    return specRegEntry;
  }

}
