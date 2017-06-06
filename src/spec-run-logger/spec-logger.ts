import {ISpecRunLog, ISpecRunLogger, ISpecMethodRunLog} from "./interfaces";
import {ISpecExecutable, ISpecMethod} from "../specRegistry/specRegistryEntry/ISpec";
import {SpecMethodType} from "../specRegistry/testMethodRegistryEntry/spec-method-type";
export class SpecRunLogger implements ISpecRunLogger {
  logs = new Map<String, SpecRunLog>();

  public log(spec: ISpecExecutable, methodName: string, success: boolean, error?: Error) {
    let specLog = this.logs.get(spec.getClassName());
    if (specLog != null && specLog.getSpec() != spec)
      throw new Error('SpecRunLogger cannot log two classes with same Name');
    if (specLog == null) {
      specLog = new SpecRunLog(spec);
      this.logs.set(spec.getClassName(), specLog);
    }
    let specMethod = spec.getMethod(methodName);
    if(specMethod == null) {
      console.log(spec.getGivenArray());
      throw new Error('SpecMethod ' + methodName + ' does not exist in SpecRegistry' + spec.getClassName());
    }
    specLog.log(specMethod, success, error);
  }

  getLogs(): Array<ISpecRunLog> {
    return Array.from(this.logs.values());
  }

  getSpecLogOf(className: string): ISpecRunLog {
    return this.logs.get(className);
  }
}

class SpecRunLog implements ISpecRunLog {
  private spec: ISpecExecutable;
  private logs = new Array<ISpecMethodRunLog>();

  constructor(spec: ISpecExecutable) {
    this.spec = spec;
  }

  public log(specMethod: ISpecMethod, success: boolean, error?: Error) {
    this.logs.push(new SpecMethodRunLog(specMethod, success, error));
  }

  private addLog(log: ISpecMethodRunLog){
    this.logs.push(log);
  }

  public getSpec(): ISpecExecutable {
    return this.spec;
  }

  public getLogs():Array<ISpecMethodRunLog> {
    return this.logs;
  }

  public getLogsForMethodName(methodName: string): Array<ISpecMethodRunLog> {
    let returnLogs = new Array<ISpecMethodRunLog>();
    this.logs.forEach((log) => {
      if (log.getMethodName() == methodName) returnLogs.push(log);
    });
    return returnLogs;
  }

  public newForFailed(): ISpecRunLog {
    let failedSpecLog = new SpecRunLog(this.spec);

    this.logs.forEach((log) => {
      if(!log.isSuccess())
        failedSpecLog.addLog(log);
    });
    return failedSpecLog;
  }

  public getFailed(): Array<ISpecMethodRunLog>{
    let failed = Array<ISpecMethodRunLog>();

    this.logs.forEach((log) => {
      if(!log.isSuccess())
        failed.push(log);
    });
    return failed;
  }

}

class SpecMethodRunLog implements ISpecMethodRunLog {
  private specMethod: ISpecMethod;
  private success: boolean;
  private error: Error;

  constructor(specMethod: ISpecMethod, success: boolean, error?: Error) {
    this.specMethod = specMethod;
    this.success = success;
    this.error = error;
  }

  getSpecMethod():ISpecMethod{
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
