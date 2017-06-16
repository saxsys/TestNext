import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecMethodType} from "../../SpecStorage/specContainer/specMethodContainer/spec-method-type";
import {SpecValidationError} from "../specValidator/spec-validation-error";
import {ISpecMethodContainer} from "../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";

export interface ISpecReporter {
  /*
  reportRun(specContainer: ISpecContainer, methodName: string, isSuccess: boolean, error?: Error);
  reportValidationError(specContainer: ISpecContainer, error: SpecValidationError);
  */
  getReports(): Array<ISpecReport>;
  getSpecReportOf(className:string):ISpecReport;
  getOrCreateSpecReport(spec:ISpecContainer):ISpecReport;
}

export interface ISpecReport {
  reportRun(specMethod: ISpecMethodContainer, success: boolean, error?: Error);
  reportValidationError(error: SpecValidationError);
  setIgnored(reason:string);
  setNotExecutable(value?:boolean);

  getSpec(): ISpecContainer;
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
  getSpecMethod():ISpecMethodContainer;
  getMethodName(): string;
  getMethodType(): SpecMethodType;
  getDescription(): string;
  isSuccess(): boolean
  getError(): Error;
}
