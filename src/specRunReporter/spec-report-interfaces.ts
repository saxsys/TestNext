import {ISpec, ISpecMethod} from "../spec/ISpec";
import {SpecMethodType} from "../specRegistry/specMethod/spec-method-type";
import {SpecValidationError} from "../specRunner/specValidator/spec-validation-error";

export interface ISpecReporter {
  /*
  reportRun(spec: ISpec, methodName: string, isSuccess: boolean, error?: Error);
  reportValidationError(spec: ISpec, error: SpecValidationError);
  */
  getReports(): Array<ISpecReport>;
  getSpecReportOf(className:string):ISpecReport;
  getOrCreateSpecReport(spec:ISpec):ISpecReport;
}

export interface ISpecReport {
  reportRun(specMethod: ISpecMethod, success: boolean, error?: Error);
  reportValidationError(error: SpecValidationError);
  setIgnored(reason:string);
  setNotExecutable(value?:boolean);

  getSpec(): ISpec;
  getReports():Array<ISpecMethodRunReport>;
  getValidationErrors():Array<SpecValidationError>;
  getReportsForMethodName(methodName: string): Array<ISpecMethodRunReport>;
  getFailReports(): Array<ISpecMethodRunReport>;
  isRunFailed(): boolean;
  isInvalidSpec():boolean;
  isIgnored():boolean;
  getIgnoreReason():string;
  isExecutable():boolean;

}

export interface ISpecMethodRunReport {
  getSpecMethod():ISpecMethod;
  getMethodName(): string;
  getMethodType(): SpecMethodType;
  getDescription(): string;
  isSuccess(): boolean
  getError(): Error;
}
