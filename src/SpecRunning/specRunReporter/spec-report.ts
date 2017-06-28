import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecValidationError} from "../specValidator/spec-validation-error";
import {ISpecMethodContainer} from "../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecMethodReport} from "./spec-method-report";
import {ISpecReport} from "./iSpec-report";
import {ISpecMethodRunReport} from "./iSpec-method-report";


export class SpecReport implements ISpecReport {

  private spec: ISpecContainer;
  private methodReports = new Array<ISpecMethodRunReport>();
  private valdidationErrors = new Array<SpecValidationError>();
  private ignoredReason: String = null;
  private executable = true;

  constructor(spec: ISpecContainer) {
    this.spec = spec;
  }



  reportRun(specMethod: ISpecMethodContainer, success: boolean, error?: Error) {
    this.methodReports.push(new SpecMethodReport(specMethod, success, error));
  }

  reportValidationError(error: SpecValidationError) {
    this.valdidationErrors.push(error);
  }

  setIgnored(reason:string){
    this.ignoredReason = reason
  }

  setNotExecutable(value?:boolean){
    if(value == null)
      this.executable = false;
    if(value == false)
      this.executable = true;
  }

  getSpec(): ISpecContainer {
    return this.spec;
  }

  getReports(): Array<ISpecMethodRunReport> {
    return this.methodReports;
  }

  getReportsForMethodName(methodName: string): Array<ISpecMethodRunReport> {
    let returnReports = new Array<ISpecMethodRunReport>();
    this.methodReports.forEach((report) => {
      if (report.getMethodName() == methodName) returnReports.push(report);
    });
    return returnReports;
  }

  getValidationErrors(): Array<SpecValidationError> {
    return this.valdidationErrors;
  }

  getFailReports(): Array<ISpecMethodRunReport> {
    let failed = Array<ISpecMethodRunReport>();

    this.methodReports.forEach((report) => {
      if (!report.isSuccess())
        failed.push(report);
    });
    return failed;
  }

  isRunFailed(): boolean {
    return (this.getFailReports().length > 0)
  }

  isInvalidSpec():boolean{
    return this.valdidationErrors.length > 0;
  }

  isIgnored():boolean{
    if(this.ignoredReason == null)
      return false;
    else
      return true;
  }

  getIgnoreReason():string{
    if(this.ignoredReason == null)
      return '';
    else
      return this.ignoredReason.toString();
  }

  isExecutable():boolean{
    return this.executable;
  }
}
