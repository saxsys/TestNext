import {ISpec, ISpecMethod} from "../spec/ISpec";
import {ISpecReporter, ISpecReport} from "../specRunReporter/spec-report-interfaces";
import {SpecValidator} from "./specValidator/spec-validator";
import {AssertionError} from "../assert/assertion-Error";
import {SpecValidationError} from "./specValidator/spec-validation-error";

export class SpecRunner {

  private spec: ISpec;
  private specReport: ISpecReport;
  private specObject:any;

  constructor(spec:ISpec, specReporter: ISpecReporter){
    this.spec = spec;
    this.specReport = specReporter.getOrCreateSpecReport(spec);
  }

  runSpec(otherReporter?:ISpecReporter): ISpecReport{
    if(otherReporter != null){
      this.specReport = otherReporter.getOrCreateSpecReport(this.spec)
    }
    if(this.spec.isIgnored()) {
      this.specReport.setIgnored(this.spec.getIgnoreReason());
      return this.specReport;
    }
    if(!this.spec.isExecutableSpec()) {
     this.specReport.setNotExecutable();
      return this.specReport;
    }
    let validity = this.validateSpec();
    if(!validity) {
      this.specObject = null;
      return this.specReport;
    }
    this.specObject =  this.spec.getNewSpecObject();
    this.runGiven();
    this.runWhen();
    this.runThen();
    return this.specReport;
  }

  private validateSpec():boolean{
    try{
      SpecValidator.validate(this.spec);
    } catch (error){
      if(error instanceof SpecValidationError) {
        this.specReport.reportValidationError(error);
        return false;
      }
      else
        throw error;
    }
    return true;
  }

  private runGiven() {
    let methodArray = this.spec.getGiven();
    methodArray.forEach((method: ISpecMethod) => {
      this.runMethod(method);
    });
  }

  private runThen() {
    let methodArray = this.spec.getThen();
    methodArray.forEach((method: ISpecMethod) => {
      this.runMethod(method);
    });
  }

  private runWhen() {
    this.runMethod(this.spec.getWhen())
  }

  private runMethod(method: ISpecMethod){
    let execClass = this.specObject;
    if(execClass[method.getName()] == null)
      throw Error('test-Runner method ' + method.getName() + ' not found on Class ' + this.spec.getClassName());
    try {
      execClass[method.getName()]();
    } catch (error) {
      if(error instanceof AssertionError) {
        this.specReport.reportRun(method, false, error);
      } else {
        throw error;
      }
      return;
    }

    this.specReport.reportRun(method, true);
  }

  getSpecReport(): ISpecReport{
    return this.specReport;
  }

  getSpec(): ISpec{
    return this.spec;
  }

  getUsedSpecObject():any{
    return this.specObject;
  }
}
