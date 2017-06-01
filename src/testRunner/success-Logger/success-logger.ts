import {ISuccessLog, ISuccessLogger} from "./ISuccessLogger";
import {ISpecMethod} from "../../specRegistry/specRegistryEntry/ISpec";
import {AssertionError} from "../../assert/assertion-Error";

export class SuccessLogger implements ISuccessLogger {
  logs = new Map<string, SuccessLog>();

  public logSuccess(className: string, methodName: string, isSuccess: boolean, error?: AssertionError) {
    let logKey = className + '.' + methodName;
    let numberedLogKey = logKey;
    let count = 1;
    while (this.logs.get(numberedLogKey) != null) {
      numberedLogKey = logKey + '_' + count.toString();
      count++;
    }
    this.logs.set(numberedLogKey, new SuccessLog(className, methodName, isSuccess, error))
  }

  getLogs():Array<ISuccessLog>{
    return Array.from(this.logs.values());
  }

  getLog(className:string, methodName:string): SuccessLog{
    // TODO fix when 2 Logs for one method exist
    return this.logs.get(className + '.' + methodName);
  }
}

class SuccessLog implements ISuccessLog {
  private className: string;
  private methodName: string;
  private success: boolean;
  private error: AssertionError;

  constructor(className: string, methodName: string, isSuccess: boolean, error?: AssertionError) {
    this.className = className;
    this.methodName = methodName;
    this.success = isSuccess;
    this.error = error;
  }

  getClassName(): string {
    return this.className;
  }

  getMethodName(): string {
    return this.methodName;
  }

  isSuccess(): boolean {
    return this.success;
  }

  getError(): AssertionError {
    return this.error;
  }
}
