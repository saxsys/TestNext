import {ISpecReport, ISpecReporter, ISpecMethodRunReport} from "./spec-report-interfaces";
import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecMethodType} from "../../SpecStorage/specContainer/specMethodContainer/spec-method-type";
import {ISpecMethodContainer} from "../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecValidationError} from "../specRunner/specValidator/spec-validation-error";

export class SpecReporter implements ISpecReporter {

  private specReports = new Map<String, SpecReport>();


  getReports(): Array<ISpecReport> {
    return Array.from(this.specReports.values());
  }

  getSpecReportOf(className: string): ISpecReport {
    return this.specReports.get(className);
  }

  public getOrCreateSpecReport(spec: ISpecContainer): ISpecReport {
    let specReport = this.specReports.get(spec.getClassName());
    if (specReport != null && specReport.getSpec() != spec)
      throw new Error('SpecReporter cannot reportRun two classes with same Name');
    if (specReport == null) {
      specReport = new SpecReport(spec);
      this.specReports.set(spec.getClassName(), specReport);
    }

    return specReport;
  }

}

class SpecReport implements ISpecReport {

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


class SpecMethodReport implements ISpecMethodRunReport {
  private specMethod: ISpecMethodContainer;
  private success: boolean;
  private error: Error;

  constructor(specMethod: ISpecMethodContainer, success: boolean, error?: Error) {
    this.specMethod = specMethod;
    this.success = success;
    this.error = error;
  }

  getSpecMethod(): ISpecMethodContainer {
    return this.specMethod;
  }

  getMethodName(): string {
    return this.specMethod.getName();
  }

  getMethodType(): SpecMethodType {
    return this.specMethod.getMethodType();
  }

  getDescription(): string {
    return this.specMethod.getDescription();
  }

  isSuccess(): boolean {
    return this.success;
  }

  getError(): Error {
    return this.error;
  }
}
