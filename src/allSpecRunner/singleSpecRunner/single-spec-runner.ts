import {ISpecExecutable, ISpecMethod} from "../../specRegistry/specRegistryEntry/ISpec";
import {ISpecRunLogger} from "../../spec-run-logger/interfaces";
import {TestValidator} from "./testValidator/test-validator";
import {AssertionError} from "../../assert/assertion-Error";

export class SingleSpecRunner {

  private spec: ISpecExecutable;
  private successLogger: ISpecRunLogger;

  constructor(spec:ISpecExecutable, specLogger: ISpecRunLogger){
    TestValidator.validateTest(spec);
    this.spec = spec;
    this.successLogger = specLogger;
  }

  getSuccessLogger(): ISpecRunLogger{
    return this.successLogger;
  }

  public runSpec(): ISpecRunLogger{
    this.runGiven();
    this.runWhen();
    this.runThen();
    return this.successLogger;
  }

  private runMethod(method: ISpecMethod){
    let execClass = this.spec.getClass();
    if(execClass[method.getName()] == null)
      throw Error('test-Runner method ' + method.getName() + ' not found on Class ' + this.spec.getClassName());
    try {
      execClass[method.getName()]();
    } catch (error) {
      if(error instanceof AssertionError) {
        this.successLogger.log(this.spec, method.getName(), false, error);
      } else {
        throw error;
      }
      return;
    }

    this.successLogger.log(this.spec, method.getName(), true);
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

  public getSpec(): ISpecExecutable{
    return this.spec;
  }

}
