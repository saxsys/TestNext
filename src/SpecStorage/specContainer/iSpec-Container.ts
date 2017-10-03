import {ISpecMethodContainer} from "./specMethodContainer/iSpec-method-Container";
import {Provider} from "@angular/core";
import {SpecGeneratorOfProperty} from "./SpecGenerate/SpecGenerate";

export interface ISpecContainer{

  /**
   *
   * @returns a string with the description of the Spec.
   */
  getDescription():string

  /**
   * @returns the name (string) of the Class set as SpecClass
   */
  getClassName():string;

  /**
   *
   * @returns a string with the Reason, why the Spec should be ignored
   */
  getIgnoreReason():string;

  /**
   *
   * @returns as Array<String> with all subjects the Spec has
   */
  getSubjects():Array<string>;

  /**
   *
   * @returns the ISpecContainer set as parent-Spec, from where this Spec inherits Data (e.g. the Given-Methods or SUT)
   */
  getParentSpec(): ISpecContainer;

  /**
   *
   * @returns the constructor-function of the SpecClass
   */
  getClassConstructor():Function;

  /**
   * Creates a new Object of the SpecClass, on which the Spec-Methods can be executed.
   * Creates and sets the SUT in the Object, if one is set or inherited.
   * @returns a new Object of the SpecClass.
   */
  getNewSpecObject(useMock?:boolean): any;

  /**
   * @returns the set SUT
   */
  getSUT():Provider;

  /**
   *
   * @returns the Array of classes set as providers
   */
  getProviders():Array<Provider>;

  /**
   * Gives Information about the Values to be generated on the Properties
   * @return {Array<SpecGeneratorOfProperty>}
   */
  getGeneratorOnProperties():Array<SpecGeneratorOfProperty>;

  /**
   *
   * @returns the Array of ISpecMethodContainer, containing the Given-Methods set in this Spec and inherited from a Parent-Spec
   */
  getGiven():Array<ISpecMethodContainer>;

  /**
   *
   * @returns the ISpecMethodContainer, containing the When-Method,  set either in this Spec or inherited from a Parent-Spec
   */
  getWhen(): ISpecMethodContainer;

  /**
   *
   * @returns the Array of ISpecMethodContainer, containing the Then-Methods set in this Spec and inherited from a Parent-Spec
   */
  getThen(): Array<ISpecMethodContainer>;

  /**
   *
   * @returns the ISpecMethodContainer, containing the ThenTrow-Method,  set either in this Spec or inherited from a Parent-Spec
   */
  getThenThrow(): ISpecMethodContainer;

  /**
   *
   * @returns the Array of ISpecMethodContainer, containing the Cleanup-Methods set in this Spec and inherited from a Parent-Spec
   */
  getCleanup():Array<ISpecMethodContainer>


  /**
   *
   * @returns whether the Spec should be executable, depending on the Spec-Description
   */
  isExecutableSpec():boolean;

  /**
   *
   * @returns whether the Spec is marked as ignored.
   */
  isIgnored():boolean;

  /**
   * @returns whether in the When-Method an error is expected, depending whether a ThenThrow-Method is set
   */
  isExpectingErrors():boolean;
}
