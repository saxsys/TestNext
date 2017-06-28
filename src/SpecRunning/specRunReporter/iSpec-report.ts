import {ISpecMethodContainer} from "../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecValidationError} from "../specValidator/spec-validation-error";
import {ISpecContainer} from "SpecStorage/specContainer/iSpec-Container";
import {ISpecMethodRunReport} from "./iSpec-method-report";

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
