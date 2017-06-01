import {ISpecExecutable, ISpecMethod} from "../specRegistry/specRegistryEntry/ISpec";
import {ISuccessLogger} from "./success-Logger/ISuccessLogger";
import {TestValidator} from "./testValidator/test-validator";
import {AssertionError} from "../assert/assertion-Error";

export class TestRunner {

  private spec: ISpecExecutable;
  private successLogger: ISuccessLogger;

  constructor(spec:ISpecExecutable, successLogger: ISuccessLogger){
    TestValidator.validateTest(spec);
    this.spec = spec;
    this.successLogger = successLogger;
  }

  getSuccessLogger(): ISuccessLogger{
    return this.successLogger;
  }

  public runSpec(){
    this.runGiven();
    this.runWhen();
    this.runThen();
  }

  private runMethod(method: ISpecMethod){
    let execClass = this.spec.getClass();
    if(execClass[method.getName()] == null)
      throw Error('test-Runner method ' + method.getName() + ' not found on Class ' + this.spec.getClassName());
    try {
      execClass[method.getName()]();
    } catch (error) {
      if(error instanceof AssertionError) {
        this.successLogger.logSuccess(this.spec.getClassName(), method.getName(), false, error);
      } else {
        throw error;
      }
      return;
    }

    this.successLogger.logSuccess(this.spec.getClassName(), method.getName(), true);
  }

  private runGiven() {
    let methodArray = this.spec.getGivenArray();
    methodArray.forEach((method: ISpecMethod) => {
      this.runMethod(method);
    });
  }

  private runThen() {
    let methodArray = this.spec.getThenArray();
    methodArray.forEach((method: ISpecMethod) => {
      this.runMethod(method);
    });
  }

  private runWhen() {
    this.runMethod(this.spec.getWhen())
  }


}
