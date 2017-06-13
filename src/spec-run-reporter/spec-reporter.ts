import {ISpecReport, ISpecReporter, ISpecMethodRunReport} from "./spec-report-interfaces";
import {ISpec, ISpecMethod} from "../spec/ISpec";
import {SpecMethodType} from "../specRegistry/specMethod/spec-method-type";
import {SpecValidationError} from "../specRunner/specValidator/spec-validation-error";
export class SpecReporter implements ISpecReporter {

  private specReports = new Map<String, SpecReport>();

  reportRun(spec: ISpec, methodName: string, success: boolean, error?: Error) {
    let specReport = this.getOrCreateSpecReport(spec);
    let specMethod = spec.getOwnMethod(methodName);
    if (specMethod == null) {
      throw new Error('SpecMethod ' + methodName + ' does not exist in SpecRegistry' + spec.getClassName());
    }
    specReport.reportRun(specMethod, success, error);
  }

  reportValidationError(spec: ISpec, error: SpecValidationError) {
    let specReport = this.getOrCreateSpecReport(spec);
    specReport.reportValidationError(error);
  }

  getReports(): Array<ISpecReport> {
    return Array.from(this.specReports.values());
  }

  getSpecReportOf(className: string): ISpecReport {
    return this.specReports.get(className);
  }

  public getOrCreateSpecReport(spec: ISpec): ISpecReport {
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

  private spec: ISpec;
  private methodReports = new Array<ISpecMethodRunReport>();
  private valdidationErrors = new Array<SpecValidationError>();

  constructor(spec: ISpec) {
    this.spec = spec;
  }

  reportRun(specMethod: ISpecMethod, success: boolean, error?: Error) {
    this.methodReports.push(new SpecMethodReport(specMethod, success, error));
  }

  reportValidationError(error: SpecValidationError) {
    this.valdidationErrors.push(error);
  }

  private addReport(report: ISpecMethodRunReport) {
    this.methodReports.push(report);
  }

  getSpec(): ISpec {
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

}


class SpecMethodReport implements ISpecMethodRunReport {
  private specMethod: ISpecMethod;
  private success: boolean;
  private error: Error;

  constructor(specMethod: ISpecMethod, success: boolean, error?: Error) {
    this.specMethod = specMethod;
    this.success = success;
    this.error = error;
  }

  getSpecMethod(): ISpecMethod {
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
