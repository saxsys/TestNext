import {ISpecMethodContainer} from "../../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecMethodType} from "../../../SpecStorage/specContainer/specMethodContainer/spec-method-type";
import {ISpecMethodReport} from "./iSpec-method-report";

/**
 * Report of a single execution of a single SpecMethod
 */
export class SpecMethodReport implements ISpecMethodReport {
  private specMethod: ISpecMethodContainer;
  private success: boolean;
  private error: Error;

  /**
   * @param specMethod ISpecMethodContainer, with information about the Method
   * @param success whether the run was successful of had errors
   * @param error optional, registers the thrown error while execution
   */
  constructor(specMethod: ISpecMethodContainer, success: boolean, error?: Error) {
    this.specMethod = specMethod;
    this.success = success;
    this.error = error;
  }

  /**
   * @return {ISpecMethodContainer} the MethodContainer of the reported Method
   */
  getSpecMethod(): ISpecMethodContainer {
    return this.specMethod;
  }

  /**
   * @return {string} Name of the reported Method
   */
  getMethodName(): string {
    return this.specMethod.getName();
  }

  /**
   * @return {SpecMethodType} Type of the reported Method (Given, When, Then, ThenThrow)
   */
  getMethodType(): SpecMethodType {
    return this.specMethod.getMethodType();
  }

  /**
   * @return {string} Description of the reported Method
   */
  getDescription(): string {
    return this.specMethod.getDescription();
  }

  /**
   * @return {boolean} whether the run was reported as successful or had errors
   */
  isSuccess(): boolean {
    return this.success;
  }

  /**
   * @return {Error} the error which was reported, null if no error was reported
   */
  getError(): Error {
    return this.error;
  }
}
