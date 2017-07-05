import {ISpecContainer} from "../../../SpecStorage/specContainer/iSpec-Container";
import {SpecValidationError} from "../../specValidator/spec-validation-error";
import {ISpecMethodContainer} from "../../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecMethodReport} from "../specMethodReport/spec-method-report";
import {ISpecReport} from "./iSpec-report";
import {ISpecMethodReport} from "../specMethodReport/iSpec-method-report";
import {SpecRunStatus} from "../spec-run-status";

/**
 * Collection of reports reported for a single exectuion of one Spec
 * including validation- and run-reports
 */
export class SpecReport implements ISpecReport {



  private spec: ISpecContainer;
  private methodReports = new Array<ISpecMethodReport>();
  private validationErrors = new Array<SpecValidationError>();
  private ignoredReason: String = null;
  private executable = true;

  /**
   * @param specContainer SpecContainer for the Spec to report
   */
  constructor(specContainer: ISpecContainer) {
    this.spec = specContainer;
  }


  /**
   * reports that a Method was executed
   * @param specMethod
   * @param success whether the run was successful
   * @param error optional, error which was thrown while executing the method
   */
  reportRun(specMethod: ISpecMethodContainer, success: boolean, error?: Error) {
    this.methodReports.push(new SpecMethodReport(specMethod, success, error));
  }

  /**
   * reports an error that was thrown while validating the Spec
   * @param error
   */
  reportValidationError(error: SpecValidationError) {
    this.validationErrors.push(error);
  }

  /**
   * report that the Spec was not executed because it is marked as ignored, because of a reason
   * @param reason why the Spec was not Executed
   */
  setIgnored(reason:string){
    this.ignoredReason = reason
  }

  /**
   * report the Spec as not Executable (or revert that with argument false)
   * @param value optional, default true
   */
  setNotExecutable(value?:boolean){
    if(value == null)
      this.executable = false;
    if(value == false)
      this.executable = true;
  }



  /**
   * returns the specContainer for which the reports are made
   * @return {ISpecContainer}
   */
  getSpecContainer(): ISpecContainer {
    return this.spec;
  }

  /**
   * @return {string} Name of the SpecClass
   */
  getSpecClassName(): string {
    return this.spec.getClassName();
  }

  /**
   * @return {string} Description of the reported Method
   */
  getSpecDescription(): string {
    return this.spec.getDescription();
  }

  /**
   * @return {ISpecMethodReport[]} Array of the Reports for the Execution of the SpecMethods
   */
  getRunReports(): Array<ISpecMethodReport> {
    return this.methodReports;
  }

  /**
   * get reports for execution of one specific method
   * @param methodName Name of the asked method
   * @return {ISpecMethodReport[]} reports for the asked method
   */
  getReportsForMethodName(methodName: string): Array<ISpecMethodReport> {
    let returnReports = new Array<ISpecMethodReport>();
    this.methodReports.forEach((report) => {
      if (report.getMethodName() == methodName) returnReports.push(report);
    });
    return returnReports;
  }

  /**
   * @return {SpecValidationError[]} all Errors occurred while validating the Spec
   */
  getValidationErrors(): Array<SpecValidationError> {
    return this.validationErrors;
  }

  /**
   * get only failed reports
   * @return {ISpecMethodReport[]} Array with reports for only failed SpecMethods
   */
  getFailReports(): Array<ISpecMethodReport> {
    let failed = Array<ISpecMethodReport>();

    this.methodReports.forEach((report) => {
      if (!report.isSuccess())
        failed.push(report);
    });
    return failed;
  }

  /**
   * @return {boolean} whether errors occurred executing the Spec
   */
  isRunFailed(): boolean {
    return (this.getFailReports().length > 0)
  }

  /**
   * @return {boolean} whether the Spec was reported as invalid
   */
  isInvalidSpec():boolean{
    return this.validationErrors.length > 0;
  }

  /**
   * @return {boolean} whether the Spec was reported as ignored
   */
  isIgnored():boolean{
    if(this.ignoredReason == null)
      return false;
    else
      return true;
  }

  /**
   * @return {String} reported reason why the Spec was ignored, null if it was not reported as such
   */
  getIgnoreReason():String{
    return this.ignoredReason;
  }

  /**
   * @return {boolean} whether the Spec was reported as executable
   */
  isExecutable():boolean{
    return this.executable;
  }

  getRunStatus():SpecRunStatus{
    if(this.isIgnored()){
      return SpecRunStatus.IGNORED;
    } else if(!this.isExecutable()){
      return SpecRunStatus.NOT_EXECUTABLE;
    } else if( this.isInvalidSpec()){
      return SpecRunStatus.INVALID;
    } else if(this.isRunFailed()){
      return SpecRunStatus.FAILED;
    } else {
      return SpecRunStatus.SUCCESSFUL;
    }
  }

}


