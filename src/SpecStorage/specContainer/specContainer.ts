import {Provider, ReflectiveInjector} from "@angular/core";

import {ISpecContainer} from './iSpec-Container';
import {ISpecMethodContainer} from "./specMethodContainer/iSpec-method-Container";
import {SpecMethodContainer} from "./specMethodContainer/spec-method-container";
import {SpecMethodType} from "./specMethodContainer/spec-method-type";

import {SpecRegistryError} from "../spec-registry-error";
import * as _ from "underscore";

/**
 * Class to contain a SpecClass and store additional information on the Spec (such as Given-, When-, Then-Methods, Ignored or the SUT)
 */
export class SpecContainer implements ISpecContainer{

  private specClassConstructor: any;
  private specDescription: string;
  private subjects = new Array<string>();
  private ignored: boolean = false;
  private ignoreReason: string = '';

  private parent: ISpecContainer;
  private sut:Provider;
  private providers =  new Array<Provider>();

  private given = new Map<number, SpecMethodContainer>(); // exec-Number, MethodName
  private when: SpecMethodContainer;
  private then = new Map<number, SpecMethodContainer>();
  private thenThrow: SpecMethodContainer;

  /**
   *
   * @param specClassConstructor Constructor of the SpecClass (get it via <Class>.prototype.constructor)
   * @param parentSpec optional, Parent SpecClass, of witch the new SpecClass inherits (e.g. Given-Methods or the SUT)
   */
  constructor(specClassConstructor: Function, parentSpec?:ISpecContainer) {
    if(this.specClassConstructor)
      throw new Error ('Cannot instantiate SpecContainer with specClassConstructor = null');
    this.specClassConstructor = specClassConstructor;
    this.parent = parentSpec;
  }

  /**
   * Description of the Spec, necessary to be set, to count as an executable Spec
   * @param description
   */
  setDescription(description: string) {
    if (this.specDescription != null)
      throw new SpecRegistryError('Spec "' + this.getClassName()+ '" already got has Description: "' + this.specDescription + '", only one is possible, cannot add: "' + description + '"', this.getClassName());

    this.specDescription = description
  }

  /**
   * Sets the SUT-Class (System under Test), it will be set in the Spec-Class as "this.SUT".
   * The SUT will be created via ReflectiveInjector, all other injected dependencies necessary for it, must be set via "addProviders".
   * @param sut SUT-Class as Provider, the Class directly
   */
  setSUT(sut:Provider){
    if(this.sut != null)
      throw new SpecRegistryError('Multiple @SUT on SpecWithSUT "' + this.getClassName() + '", only one is possible', this.getClassName());

    if(!this.providers.includes(sut))
      this.providers.push(sut);

    this.sut = sut;


  }

  /**
   * Add a Subject of the Spec, multiple can be saved.
   * @param subject
   */
  addSubject(subject:string){
    if(!this.subjects.includes(subject))
      this.subjects.push(subject);
  }

  /**
   * Providers for automated SUT creation are added.
   * Make sure providing classes are decorated with '@Injectable()' if necessary.
   * @param newProviders Array of Providers for SUT (use the Class directly)
   */
  addProviders(newProviders: Array<Provider>) {
    this.providers = _.union(newProviders, this.providers);

  }

  /**
   * Mark a Spec as ignored, give a reason
   * @param reason why the spec should not be run
   */
  setIgnored(reason:string){
    this.ignored = true;
    this.ignoreReason = reason;
  }

  /**
   * Add a function that does the Setup for the Spec.
   * A check weather the function rally exists will not be done here.
   *
   * @param functionName Name of the function in the SpecClass, must be unique in the SpecClass (independent from modifier), must be public.
   * @param description
   * @param execNumber Number for execution-order. Must be set, when multiple Given-Methods exist, must unique for Given in the SpecClass.
   */
  addGiven(functionName: string, description: string, execNumber?: number) {
    if(this.getOwnMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    if (execNumber == null) execNumber = 0;
    if (this.given == null) this.given = new Map<number, SpecMethodContainer>();
    if (this.given.get(execNumber) != null)
      throw new SpecRegistryError('Multiple @given, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.given.set(execNumber, new SpecMethodContainer(functionName, description, SpecMethodType.GIVEN, execNumber));
  }

  /**
   * Set one function that includes the condition of the Spec.
   * There can only be one When-Function.
   * A check weather the function rally exists will not be done here.
   *
   * @param functionName Name of the function in the SpecClass, must be unique in the SpecClass (independent from modifier) and must be public:
   * @param description
   */
  addWhen(functionName: string, description: string) {
    if (this.when != null)
      throw new SpecRegistryError('Only one @When allowed on ' + this.getClassName() + ' cannot add ' + functionName + ', ' + this.when.getName() + ' is already @When', this.getClassName(), functionName);
    if(this.getOwnMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.when = new SpecMethodContainer(functionName, description, SpecMethodType.WHEN);
  }

  /**
   * Add a function that includes the Asserts of the Spec.
   * A check weather the function rally exists will not be done here.
   *
   * @param functionName functionName Name of the function in the SpecClass, must be unique in the SpecClass (independent from modifier) and must be public.
   * @param description
   * @param execNumber execNumber Number for execution-order. Must be set, when multiple Then-Methods exist, must unique for Then in the SpecClass.
   */
  addThen(functionName: string, description: string, execNumber: number) {
    if(this.getOwnMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    if (execNumber == null) execNumber = 0;
    if (this.then == null) this.then = new Map<number, SpecMethodContainer>();
    if (this.then.get(execNumber) != null)
      throw new SpecRegistryError('Multiple @then, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.then.set(execNumber, new SpecMethodContainer(functionName, description, SpecMethodType.THEN, execNumber));
  }

  /**
   * Set a function throwing the same Error as expected to be thrown in the When-Method
   * A check weather the function rally exists and really throws an error will not be done here.
   * @param functionName Name of the function in the SpecClass, must be unique in the SpecClass (independent from modifier) and must be public:
   * @param description
   */
  addThenError(functionName: string, description: string){
    if(this.thenThrow != null)
      throw new SpecRegistryError(
        'Only one @ThenThrow allowed on ' + this.getClassName() + ' cannot add ' + functionName +
        ', ' + this.thenThrow.getName() + ' is already @ThenThrow', this.getClassName(),
        functionName
      );
    if(this.getOwnMethod(functionName) != null)
      throw new SpecRegistryError(
        'Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(),
        functionName
      );
    this.thenThrow = new SpecMethodContainer(functionName, description, SpecMethodType.THEN_ERROR);
  }

  /**
   *
   * @returns a string with the description of the Spec.
   */
  getDescription():string{
    return this.specDescription;
  }

  /**
   *
   * @returns as Array<String> with all subjects the Spec has
   */
  getSubjects():Array<string>{
    return this.subjects;
  }

  /**
   *
   * @returns a string with the Reason, why the Spec should be ignored
   */
  getIgnoreReason():string{
    return this.ignoreReason;
  }

  /**
   *
   * @returns the ISpecContainer set as parent-Spec, from where this Spec inherits Data (e.g. the Given-Methods or SUT)
   */
  getParentSpec(): ISpecContainer{
    return this.parent;
  }

  /**
   * @returns the name (string) of the Class set as SpecClass
   */
  getClassName():string {
    return this.specClassConstructor.name;
  }

  /**
   *
   * @returns the constructor-function of the SpecClass
   */
  getClassConstructor():Function {
    return this.specClassConstructor;
  }

  /**
   * Creates a new Object of the SpecClass, on which the Spec-Methods can be executed.
   * Creates and sets the SUT in the Object, if one is set or inherited.
   * @returns a new Object of the SpecClass.
   */
  getNewSpecObject(): any{
    if(this.specClassConstructor == null)
      throw new SpecRegistryError('Class of ' + this.getClassName() + 'is not set', this.getClassName());
    if(this.specClassConstructor.length > 0)
      throw new SpecRegistryError('Class of "' + this.getClassName() + '" has constructor-arguments, this is forbidden', this.getClassName());

    let object =  new this.specClassConstructor;

    try {
      let sut = this.getSUT();
      if (sut != null) {
        let injector = ReflectiveInjector.resolveAndCreate(this.getProviders());
        object['SUT'] = injector.get(sut);
      }
    } catch(error){
      throw new SpecRegistryError(error.message, this.getClassName());
    }



    return object;
  };

  /**
   *
   * @returns weather the Spec is marked as ignored.
   */
  isIgnored():boolean{
    return this.ignored;
  }

  /**
   * @returns the set SUT
   */
  getSUT():Provider {
    if(this.sut != null)
      return this.sut;
    else if(this.parent != null)
      return this.parent.getSUT();
    else
      return null;

  }

  /**
   *
   * @returns the Array of classes set as providers
   */
  getProviders():Array<Provider>{
    let providers = this.providers;

    if(this.parent != null) {
      providers = _.union(providers, this.parent.getProviders());
    }


    return providers;
  }

  /**
   *
   * @returns the Array of ISpecMethodContainer, containing the Given-Methods set in this Spec and inherited from a Parent-Spec
   */
  getGiven():Array<ISpecMethodContainer>{
    let returnMethods = new Array<ISpecMethodContainer>();

    if(this.parent != null) {
      returnMethods = returnMethods.concat(this.parent.getGiven());
    }
    returnMethods = returnMethods.concat(this.getOwnGiven());
    return returnMethods;
  }
  /**
   *
   * @returns the ISpecMethodContainer, containing the When-Method,  set either in this Spec or inherited from a Parent-Spec
   */
  getWhen():ISpecMethodContainer{
    if(this.when != null)
      return this.when;
    if(this.parent != null)
      return this.parent.getWhen();
  }

  /**
   *
   * @returns the Array of ISpecMethodContainer, containing the Then-Methods set in this Spec and inherited from a Parent-Spec
   */
  getThen():Array<ISpecMethodContainer>{
    let returnMethods = new Array<ISpecMethodContainer>();
    if(this.parent != null)
      returnMethods = returnMethods.concat(this.parent.getThen());
    returnMethods = returnMethods.concat(this.getOwnThen());

    return returnMethods;
  }

  /**
   *
   * @returns the ISpecMethodContainer, containing the ThenTrow-Method,  set either in this Spec or inherited from a Parent-Spec
   */
  getThenThrow():ISpecMethodContainer{
    if(this.thenThrow != null)
      return this.thenThrow;
    if(this.parent != null)
      return this.parent.getThenThrow();
  }


  /**
   *
   * @returns weather the Spec should be executable, depending on the Spec-Description
   */
  isExecutableSpec():boolean{
    if(this.specDescription == null)
      return false;
    return true;
  }

  /**
   * @returns weather in the When-Method an error is expected, depending weather a ThenThrow-Method is set
   */
  isExpectingErrors():boolean{
    if(this.thenThrow != null)
      return true;
    return false;
  }


  /**
   * @param methodName
   * @returns the ISpecMethodContainer for a Given-Method with the methodName from this Spec (not inherited Methods)
   */
  private getOwnGivenByName(methodName:string): ISpecMethodContainer{
    let returnMethod = null;
    this.given.forEach((method) => {
      if(method.getName() == methodName) {
        returnMethod = method;
        return;
      }
    });
    return returnMethod;
  }
  /**
   * @param methodName
   * @returns the ISpecMethodContainer for a Then-Method with the methodName from this Spec (not inherited Methods)
   */
  private getOwnThenByName(methodName:string): ISpecMethodContainer{
    let returnMethod = null;
    this.then.forEach((method) => {
      if(method.getName() == methodName) {
        returnMethod = method;
        return;
      }
    });

    return returnMethod;
  }

  /**
   *
   * @returns an Array of ISpecMethodContainer, for all Given-Methods from this Spec (not inherited Methods)
   */
  private getOwnGiven(): Array<ISpecMethodContainer> {
    let keys = Array.from(this.given.keys()).sort();

    let returnArray = new Array<SpecMethodContainer>();
    keys.forEach((key) => {
      returnArray.push(this.given.get(key));
    });
    return returnArray;
  }

  /**
   *
   * @returns an ISpecMethodContainer, for the When-Method from this Spec (not inherited Methods)
   */
  private getOwnWhen(): ISpecMethodContainer {
    return this.when;
  }

  /**
   *
   * @returns an Array of ISpecMethodContainer, for all Then-Methods from this Spec (not inherited Methods)
   */
  private getOwnThen(): Array<ISpecMethodContainer> {
    let keys = Array.from(this.then.keys()).sort();

    let returnArray = new Array<SpecMethodContainer>();
    keys.forEach((key) => {
      returnArray.push(this.then.get(key));
    });
    return returnArray;
  }

  /**
   *
   * @returns an ISpecMethodContainer, for the ThenThrow-Method from this Spec (not inherited Methods)
   */
  private getOwnThenThrow():ISpecMethodContainer{
    return this.thenThrow;
  }

  /**
   *
   * @returns an Array of ISpecMethodContainer, for all Spec-Method from this Spec (not inherited Methods)
   */
  private getOwnMethods():Array<ISpecMethodContainer>{
    let methods = new Array<ISpecMethodContainer>();
    methods = methods.concat(this.getOwnGiven());
    methods.push(this.getOwnWhen());
    methods = methods.concat(this.getOwnThen());
    methods = methods.concat(this.getOwnThenThrow());
    return methods;
  }

  /**
   * @param methodName
   * @returns the ISpecMethodContainer for a Spec-Method with the methodName from this Spec (not inherited Methods)
   */
  private getOwnMethod(methodName: string):ISpecMethodContainer{
    let method;

    if(this.when != null && this.when.getName() == methodName)
      return this.when;

    if(this.thenThrow != null && this.thenThrow.getName() == methodName)
      return this.thenThrow;

    method = this.getOwnGivenByName(methodName);
    if(method != null )
      return method;

    method = this.getOwnThenByName(methodName);
    return method;
  }
}



