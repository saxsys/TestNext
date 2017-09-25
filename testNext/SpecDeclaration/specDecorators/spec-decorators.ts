import {specRegistry} from "../../SpecStorage/specRegistry/spec-registry-storage";
import {Provider} from "@angular/core";

/**
 * Class-Decorator
 * Registers the SpecClass as such, sets the description and marks it as executable
 * @param description
 */
export function Spec(description: string) {
  return (constructor: Function) => {
    specRegistry.registerSpec(constructor, description);
  }
}
/**
 * Method-Decorator
 * Marks method to do the Setup for the SpecClass.
 * (Method will be stored as Given-Method)
 * There can be multiple @Given per SpecClass
 * Containing class gets registered so the Method can Be inherited, SpecClass will not necessarily be executed.
 *
 * @param description
 * @param execNumber Number for execution-order. Set, when the order of execution matters, if you set one you must set it unique and for all Given-Methods
 */
export function Given(description: string, execNumber?: number) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerGivenForSpec(constructor, key, description, execNumber);
  }
}

/**
 * Method-Decorator
 * Marks method as including the condition of the Spec.
 * (Method will be stored as When-Method)
 * There can only be one @When per SpecClass.
 * Containing class gets registered so the Method can Be inherited, SpecClass will not necessarily be executed.
 *
 * @param description
 */
export function When(description: string) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerWhenForSpec(constructor, key, description);
  }
}

/**
 * Method-Decorator
 * Marks method to do contain the Assertions of the Spec.
 * (Method will be stored as Then-Method)
 * There can be multiple @Then per SpecClass
 * Containing class gets registered so the Method can be inherited, but the SpecClass will not necessarily be executed.
 *
 * @param description
 * @param execNumber Number for execution-order. Set, when the order of execution matters, if you set one you must set it unique and for all Then-Methods.
 */
export function Then(description: string, execNumber?: number) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerThenForSpec(constructor, key, description, execNumber);
  }
}

/**
 * Method-Decorator
 * Marks the to throw the same Error as expected to be thrown in the @When-Method
 * (Method will be stored as ThenThrow-Method)
 * There can only be one @ThenThrow per SpecClass.
 * Containing class gets registered so the Method can be inherited, but the SpecClass will not necessarily be executed.
 *
 * @param description
 */
export function ThenThrow(description: string) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerThenThrowForSpec(constructor, key, description,);
  }
}

/**
 * Method-Decorator
 * Marks method to do the Cleanup  after the Spec was executed.
 * (Method will be stored as Cleanup-Method)
 * There can be multiple @Cleanup per SpecClass
 * Containing class gets registered so the Method can be inherited, but the SpecClass will not necessarily be executed.
 *
 * @param description (optional)
 * @param execNumber (optional), Number for execution-order. Set, when the order of execution matters, if you set one you must set it unique and for all Cleanup-Methods.
 */
export function Cleanup(description?: string, execNumber?: number) {
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerCleanupForSpec(constructor, key, description, execNumber);
  }
}


/**
 * Class-Decorator
 * registers the SpecClass for a Subject
 * One Subject can have multiple SpecClasses and one SpecClass can have multiple Subjects
 * Class gets registered so it can be inherited, but the SpecClass will not necessarily be executed.
 *
 * @param subjectName
 */
export function Subject(subjectName: string) {
  return (constructor: Function) => {

    specRegistry.registerSpecForSubject(constructor, subjectName);
  }
}

/**
 * Class-Decorator
 * Marks the Class as ignored, so it will not be executed, nevertheless it gets registered.
 *
 * @param reason
 * @return {(constructor:Function)=>undefined}
 * @constructor
 */
export function Ignore(reason: string) {
  return (constructor: Function) => {
    specRegistry.registerSpecAsIgnored(constructor, reason);
  }
}

/**
 * Class-Decorator
 * Gives the Class which should be tested (System-under-Test).
 * An Instance of the Class will be created automatically, as long as all dependencies are given in @Providers()
 * Class gets registered so it can be inherited, but the SpecClass will not necessarily be executed.
 *
 * @param provider Class
 */
export function SUT(provider:Provider){
  return (constructor: Function) => {
    specRegistry.registerSutForSpec(constructor, provider);
  }
}

/**
 * Class-Decorator
 * Register Providers (Dependencies) of SUT.
 * Necessary if SUT has injected dependencies.
 * Class gets registered so it can be inherited, but the SpecClass will not necessarily be executed.
 *
 * @param providers Array of classes, necessary for instantiating the SUT
 * @return {(constructor:Function)=>undefined}
 * @constructor
 */
export function Providers(providers:Provider[]){
  return (constructor: Function) => {
    specRegistry.registerProvidersForSpec(constructor, providers);
  }
}

export function Generate(typeToGenerate:any){
  return (target: any, key: string) => {
    let constructor = target.constructor;
    specRegistry.registerGenerate(constructor, key, typeToGenerate)
  }
}
