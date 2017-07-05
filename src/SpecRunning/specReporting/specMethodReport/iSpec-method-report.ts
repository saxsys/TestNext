import {ISpecMethodContainer} from "../../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecMethodType} from "../../../SpecStorage/specContainer/specMethodContainer/spec-method-type";

/**
 * Report of a single execution of a single SpecMethod
 */
export interface ISpecMethodReport {
  /**
   * @return {ISpecMethodContainer} the MethodContainer of the reported Method
   */
  getSpecMethod():ISpecMethodContainer;

  /**
   * @return {string} Name of the reported Method
   */
  getMethodName(): string;

  /**
   * @return {SpecMethodType} Type of the reported Method (Given, When, Then, ThenThrow)
   */
  getMethodType(): SpecMethodType;

  /**
   * @return {string} Description of the reported Method
   */
  getDescription(): string;

  /**
   * @return {boolean} whether the run was reported as successful or had errors
   */
  isSuccess(): boolean

  /**
   * @return {Error} the error which was reported, null if no error was reported
   */
  getError(): Error;
}
