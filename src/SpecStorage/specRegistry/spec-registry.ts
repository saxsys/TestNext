import {SpecContainer} from "../specContainer/specContainer";
import {SpecRegistryError} from "../spec-registry-error";
import * as _ from "underscore";
import {Provider} from "@angular/core/core";

export class SpecRegistry {

  private specClasses = new Map<string, SpecContainer>();
  private subject_specNames = new Map<string, Array<string>>();


  registerSpec(specClassConstructor: Function, specName: string) {
    let specClassName = specClassConstructor.name;

    let registryEntry = this.getOrRegisterSpecClass(specClassConstructor);
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

  registerThenErrorForSpec(specClass: Function, functionName: string, description: string) {
    let specRegEntry = this.getOrRegisterSpecClass(specClass);
    specRegEntry.addThenError(functionName, description);
  }

  registerSpecForSubject(specClassConstructor:Function , subject:string ){
    let specClassName = specClassConstructor.name;

    //write subject into SpecContainer
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

  registerSutForSpec(specClassConstructor:Function, sut:Provider){
    let spec = this.getOrRegisterSpecClass(specClassConstructor);
    spec.setSUT(sut);
  };

  registerProvidersForSpec(specClassConstructor:Function, providers:Array<Provider>){
    let spec = this.getOrRegisterSpecClass(specClassConstructor);
    spec.addProviders(providers);
  }

  getSpecClassNames(): Array<String> {
    return Array.from(this.specClasses.keys());
  }

  getSubjects():Array<string>{
    return Array.from(this.subject_specNames.keys());
  }

  getSpecByClassName(className: string): SpecContainer {
    return this.specClasses.get(className);
  }

  getAllSpecs(): Array<SpecContainer>{
    return Array.from(this.specClasses.values());
  }

  getSpecsForSubject(subject:string):Array<SpecContainer>{
    let specs = new Array<SpecContainer>();
    let classNames = this.subject_specNames.get(subject);

    if(classNames == null)
      return null;

    classNames.forEach((className) => {
      specs.push(this.getSpecByClassName(className));
    });

    return specs;

  }

  getSpecsWithoutSubject():Array<SpecContainer>{
    let allRemainingSpecNames = Array.from(this.specClasses.keys());

    this.subject_specNames.forEach((specs) => {
      allRemainingSpecNames = _.difference(allRemainingSpecNames, specs);
    });

    let specsWithoutSubject = new Array<SpecContainer>();
    allRemainingSpecNames.forEach((specName) => {
      specsWithoutSubject.push(this.specClasses.get(specName));
    });
    return specsWithoutSubject;
  }

  getExecutableSpecs():Array<SpecContainer>{
    let executableSpecs = new Array<SpecContainer>();
    Array.from(this.specClasses.values()).forEach((spec) => {
      if(spec.isExecutableSpec())
        executableSpecs.push(spec);
    });
    return executableSpecs;
  }

  private getOrRegisterSpecClass(specClassConstructor:Function): SpecContainer{
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

      specRegEntry = new SpecContainer(specClassConstructor, parentSpec);
      this.specClasses.set(specClassName, specRegEntry);
    } else {
      if(specRegEntry.getClassConstructor() != specClassConstructor){
        throw new SpecRegistryError('A different Class with the Name "' + specClassName + '" is already registered, class-name-duplicates are forbidden', specClassName);
      }
    }
    return specRegEntry;
  }


}
