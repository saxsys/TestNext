import {ISpecExecutable, ISpecMethod} from "../../specRegistry/specRegistryEntry/ISpec";
import {AssertionError} from "../../assert/assertion-Error";

export interface ISuccessLogger{

  logSuccess(className: string, method: string, isSuccess: boolean, error?: AssertionError);

  getLogs(): Array<ISuccessLog>;
}

export interface ISuccessLog{
  getClassName(): string;
  getMethodName(): string;
  isSuccess(): boolean;
  getError(): AssertionError;
}
