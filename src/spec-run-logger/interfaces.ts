import {ISpecExecutable, ISpecMethod} from "../specRegistry/specRegistryEntry/ISpec";
import {AssertionError} from "../assert/assertion-Error";
import {SpecMethodType} from "../specRegistry/testMethodRegistryEntry/spec-method-type";

export interface ISpecRunLogger {

  log(spec: ISpecExecutable, methodName: string, isSuccess: boolean, error?: Error)
  getLogs(): Array<ISpecRunLog>;
  getSpecLogOf(className:string):ISpecRunLog;
}

export interface ISpecRunLog {
  log(specMethod: ISpecMethod, success: boolean, error?: Error);
  getSpec(): ISpecExecutable;
  getLogs():Array<ISpecMethodRunLog>;
  getLogsForMethodName(methodName: string): Array<ISpecMethodRunLog>;
}

export interface ISpecMethodRunLog {
  getSpecMethod():ISpecMethod
  getMethodName(): string;
  getMethodType(): SpecMethodType;
  getDescription(): string;
  isSuccess(): boolean
  getError(): Error;
}
