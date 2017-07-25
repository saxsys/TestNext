import {ISpecMethodContainer} from "../../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecValidationError} from "../../specValidator/spec-validation-error";
import {ISpecContainer} from "../../../SpecStorage/specContainer/iSpec-Container";
import {ISpecMethodReport} from "../specMethodReport/iSpec-method-report";
import {SpecRunStatus} from "../spec-run-status";

/**
 * Collection of reports reported for a single exectuion of one Spec
 * including validation- and run-reports
 */
export interface ISpecReport {

  /**
   * reports that a Method was executed
   * @param specMethod
   * @param success whether the run was successful
   * @param error optional, error which was thrown while executing the method
   */
  reportRun(specMethod: ISpecMethodContainer, success: boolean, error?: Error);

  /**
   * reports an error that was thrown while validating the Spec
   * @param error
   */
  reportValidationError(error: SpecValidationError);

  /**
   * report that the Spec was not executed because it is marked as ignored, because of a reason
   * @param reason why the Spec was not Executed
   */
  setIgnored(reason:string);

  /**
   * report the Spec as not Executable (or revert that with argument false)
   * @param value optional, default true
   */
  setNotExecutable(value?:boolean);

  /**
   * returns the specContainer for which the reports are made
   * @return {ISpecContainer}
   */
  getSpecContainer(): ISpecContainer;

  /**
   * @return {string} Name of the SpecClass
   */
  getSpecClassName():string;

  /**
   * @return {string} Description of the Spec
   */
  getSpecDescription():string;

  /**
   * @return {ISpecMethodReport[]} Array of the Reports for the Execution of the SpecMethods
   */
  getMethodReports():Array<ISpecMethodReport>;

  /**
   * get reports for execution of one specific method
   * @param methodName Name of the asked method
   * @return {ISpecMethodReport[]} reports for the asked method
   */
  getReportsForMethodName(methodName: string): Array<ISpecMethodReport>;

  /**
  * @return {SpecValidationError[]} all Errors occurred while validating the Spec
  */
  getValidationErrors():Array<SpecValidationError>;

  /**
   * get only failed reports
   * @return {ISpecMethodReport[]} Array with reports for only failed SpecMethods
   */
  getFailReports(): Array<ISpecMethodReport>;

  /**
   * @return {boolean} whether errors occurred executing the Spec
   */
  isRunFailed(): boolean;

  /**
   * @return {boolean} whether the Spec was reported as invalid
   */
  isInvalidSpec():boolean;

  /**
   * @return {boolean} whether the Spec was reported as ignored
   */
  isIgnored():boolean;

  /**
   * @return {String} reported reason why the Spec was ignored, null if it was not reported as such
   */
  getIgnoreReason():String;

  /**
   * @return {boolean} whether the Spec was reported as executable
   */
  isExecutable():boolean;

  /**
   * @return {SpecRunStatus} stat of execution of the Spec
   */
  getRunStatus():SpecRunStatus;

}
