import {ISpecExecutable, ISpecMethod} from "../specRegistry/specRegistryEntry/ISpec";
import {AssertionError} from "../assert/assertion-Error";
import {SpecMethodType} from "../specRegistry/testMethodRegistryEntry/spec-method-type";
import {SpecValidationError} from "../specRunner/specValidator/spec-validation-error";

export interface ISpecReporter {
  reportRun(spec: ISpecExecutable, methodName: string, isSuccess: boolean, error?: Error);
  reportValidationError(spec: ISpecExecutable, error: SpecValidationError);
  getReports(): Array<ISpecReport>;
  getSpecReportOf(className:string):ISpecReport;
  getOrCreateSpecReport(spec:ISpecExecutable):ISpecReport;
}

export interface ISpecReport {
  reportRun(specMethod: ISpecMethod, success: boolean, error?: Error);
  reportValidationError(error: SpecValidationError);
  getSpec(): ISpecExecutable;
  getReports():Array<ISpecMethodRunReport>;
  getValidationErrors():Array<SpecValidationError>;
  getReportsForMethodName(methodName: string): Array<ISpecMethodRunReport>;
  getFailReports(): Array<ISpecMethodRunReport>;
  isRunFailed(): boolean;
  isInvalidSpec():boolean;
}

export interface ISpecMethodRunReport {
  getSpecMethod():ISpecMethod;
  getMethodName(): string;
  getMethodType(): SpecMethodType;
  getDescription(): string;
  isSuccess(): boolean
  getError(): Error;
}
