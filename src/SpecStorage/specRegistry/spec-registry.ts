import {SpecContainer} from "../specContainer/specContainer";
import {SpecRegistryError} from "../spec-registry-error";
import * as _ from "underscore";
import {Provider} from "@angular/core/core";
import {SpecGenerationProvider} from "../specContainer/SpecGenerate/SpecGenerateProvider";

export class SpecRegistry {

  private specClasses = new Map<string, SpecContainer>();
  private subject_specNames = new Map<string, Array<string>>();

  /**
   * Creates and saves a SpecContainer for the Spec as such, sets the description and marks it so as executable
   *
   * @param specClassConstructor Constructor of the SpecClass
   * @param specDescription Description of the Spec
   */
  registerSpec(specClassConstructor: Function, specDescription: string):SpecContainer {
    let specClassName = specClassConstructor.name;

    let registryEntry = this.getOrRegisterSpecContainerForClass(specClassConstructor);
    registryEntry.setDescription(specDescription);
    return registryEntry;
  }

  /**
   * Registers the method in the SpecContainer as Given-Method for the Spec
   * Registers a SpecContainer for the Spec, if not existing, but not marks it as executable
   * No Validation happens at this point, whether the methods exists on SpecClass
   *
   * @param specClassConstructor Constructor of the SpecClass
   * @param functionName Name of the Function to register
   * @param description
   * @param execNumber place in execution order
   */
  registerGivenForSpec(specClassConstructor: Function, functionName: string, description: string, execNumber?: number) {
    let specRegEntry = this.getOrRegisterSpecContainerForClass(specClassConstructor);
    specRegEntry.addGiven(functionName, description, execNumber);
  }

  /**
   * Registers the method in the SpecContainer as When-Method for the Spec
   * Registers a SpecContainer for the Spec, if not existing, but not marks it as executable
   * No Validation happens at this point, whether the methods exists on SpecClass
   *
   * @param specClassConstructor Constructor of the SpecClass
   * @param functionName Name of the Function to register
   * @param description
   */
  registerWhenForSpec(specClassConstructor: Function, functionName: string, description: string) {
    let specRegEntry = this.getOrRegisterSpecContainerForClass(specClassConstructor);
    specRegEntry.addWhen(functionName, description);
  }

  /**
   * Registers the method in the SpecContainer as Then-Method for the Spec
   * Registers a SpecContainer for the Spec, if not existing, but not marks it as executable
   * No Validation happens at this point, whether the methods exists on SpecClass
   *
   * @param specClassConstructor Constructor of the SpecClass
   * @param functionName Name of the Function to register
   * @param description
   * @param execNumber place in execution order
   */
  registerThenForSpec(specClassConstructor: Function, functionName: string, description: string, execNumber?: number) {
    let specRegEntry = this.getOrRegisterSpecContainerForClass(specClassConstructor);
    specRegEntry.addThen(functionName, description, execNumber);
  }

  /**
   * Registers the method in the SpecContainer as ThenThrow-Method for the Spec
   * Registers a SpecContainer for the Spec, if not existing, but not marks it as executable
   * No Validation happens at this point, whether the methods exists on SpecClass or throws an error
   *
   * @param specClassConstructor Constructor of the SpecClass
   * @param functionName Name of the Function to register
   * @param description
   */
  registerThenThrowForSpec(specClassConstructor: Function, functionName: string, description: string) {
    let specRegEntry = this.getOrRegisterSpecContainerForClass(specClassConstructor);
    specRegEntry.addThenThrow(functionName, description);
  }

  registerCleanupForSpec(specClass: Function, functionName: string, description: string, execNumber?: number) {
    let specRegEntry = this.getOrRegisterSpecContainerForClass(specClass);
    specRegEntry.addCleanup(functionName, description, execNumber);
  }

  /**
   * Registers the SpecContainer for a Subject, saved in registry and SpecContainer
   * One Subject can have multiple SpecClasses and one SpecClass can have multiple Subjects
   * Registers a SpecContainer for the Spec, if not existing, but not marks it as executable
   *
   * @param specClassConstructor Constructor of the SpecClass
   * @param subject
   */
  registerSpecForSubject(specClassConstructor: Function, subject: string) {
    let specClassName = specClassConstructor.name;

    //write subject into SpecContainer
    let specRegEntry = this.getOrRegisterSpecContainerForClass(specClassConstructor);
    specRegEntry.addSubject(subject);

    //write Spec into Subject List
    let subjClasses = this.subject_specNames.get(subject);
    if (subjClasses == null) {
      subjClasses = [];
      this.subject_specNames.set(subject, subjClasses);
    } else if (subjClasses.includes(specClassName)) {
      return;
    }
    subjClasses.push(specClassName);
  }

  /**
   * Marks the Spec as ignored (in the SpecContainer).
   * Registers a SpecContainer for the Spec, if not existing, but not marks it as executable
   *
   * @param specClassConstructor Constructor of the SpecClass
   * @param reason
   */
  registerSpecAsIgnored(specClassConstructor: Function, reason: string) {
    let spec = this.getOrRegisterSpecContainerForClass(specClassConstructor);
    spec.setIgnored(reason);
  }


  /**
   * @return {string[]} with all the names of all SpecClasses in this registry
   */
  getSpecClassNames(): Array<String> {
    return Array.from(this.specClasses.keys());
  }

  /**
   * @return {string[]} with all Subject-names in this registry
   */
  getSubjects(): Array<string> {
    return Array.from(this.subject_specNames.keys());
  }

  /**
   * get the SpecContainer for the SpecClass with the name
   * @param className of the SpecClass
   * @return {SpecContainer} SpecContainer of the SpecClass
   */
  getSpecContainerByClassName(className: string): SpecContainer {
    return this.specClasses.get(className);
  }

  /**
   * returns all SpecContainers of this registry
   * @return {Array<SpecContainer>}
   */
  getAllSpecContainer(): Array<SpecContainer> {
    return Array.from(this.specClasses.values());
  }

  /**
   * returns all SpecContainers registered for the Subject
   * @param subject
   * @return {SpecContainer[]}
   */
  getSpecContainersForSubject(subject: string): Array<SpecContainer> {
    let specs = new Array<SpecContainer>();
    let classNames = this.subject_specNames.get(subject);

    if (classNames == null)
      return null;

    classNames.forEach((className) => {
      specs.push(this.getSpecContainerByClassName(className));
    });

    return specs;

  }

  /**
   *returns all SpecContainers not registered for any Subject
   * @return {SpecContainer[]}
   */
  getSpecContainersWithoutSubject(): Array<SpecContainer> {
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

  /**
   * returns all SpecConatiners marked as executable
   * @return {SpecContainer[]}
   */
  getExecutableSpecContainers(): Array<SpecContainer> {
    let executableSpecs = new Array<SpecContainer>();
    Array.from(this.specClasses.values()).forEach((spec) => {
      if (spec.isExecutableSpec())
        executableSpecs.push(spec);
    });
    return executableSpecs;
  }

  /**
   *  returns the SpecConatainer for the SpecClass, creates it if not existant, does not mark  ir as executable
   * @param specClassConstructor Constructor of the SpecClass
   * @return {SpecContainer}
   */
  private getOrRegisterSpecContainerForClass(specClassConstructor: Function): SpecContainer {
    let specClassName = specClassConstructor.name;

    let specRegEntry = this.specClasses.get(specClassName);
    if (specRegEntry == null) {

      //getParentSpec, if existing
      // TODO check if there is a better way to get Parent-Class Name
      let parentSpec = null;
      let prototype = specClassConstructor.prototype;
      if (prototype.__proto__.constructor.name != 'Object') {
        parentSpec = this.getOrRegisterSpecContainerForClass(prototype.__proto__.constructor);
      }

      specRegEntry = new SpecContainer(specClassConstructor, parentSpec);
      this.specClasses.set(specClassName, specRegEntry);
    } else {
      if (specRegEntry.getClassConstructor() != specClassConstructor) {
        throw new SpecRegistryError('A different Class with the Name "' + specClassName + '" is already registered, class-name-duplicates are forbidden', specClassName);
      }
    }
    return specRegEntry;
  }


  registerGenerate(constructor: any, property: string, typeToGenerate: Provider, providers?:Array<SpecGenerationProvider>):SpecContainer {
    let specContainer = this.getOrRegisterSpecContainerForClass(constructor);
    specContainer.addGeneratorOnProperty(property, typeToGenerate, providers);
    return specContainer

  }
}
