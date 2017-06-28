import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecValidator} from "../specValidator/spec-validator";
import {AssertionError} from "../../SpecDeclaration/assert/assertion-Error";
import {SpecValidationError} from "../specValidator/spec-validation-error";
import {ISpecMethodContainer} from "../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {AssertProportion} from "../../SpecDeclaration/assert/assert-proportion";
import {ISpecReporter} from "../specRunReporter/iSpec-reporter";
import {ISpecReport} from "../specRunReporter/iSpec-report";


export class SpecRunner {

  specContainer: ISpecContainer;
  usedObject:any;
  report:ISpecReport;

  private constructor(spec:ISpecContainer, specReport:ISpecReport){
    this.specContainer = spec;
    this.report = specReport;
  }

  static runSpec(spec:ISpecContainer, specReporter:ISpecReporter): SpecRunner{
    let specReport = specReporter.getOrCreateSpecReport(spec);
    let specRunner = new SpecRunner(spec, specReport);

    if(spec.isIgnored()) {
      specReport.setIgnored(spec.getIgnoreReason());
      return specRunner;
    }
    if(!spec.isExecutableSpec()) {
     specReport.setNotExecutable();
      return specRunner;
    }


    if(!specRunner.validateSpec()) {
      specRunner.usedObject = null;
      return specRunner;
    }

    specRunner.usedObject =  spec.getNewSpecObject();

    if(spec.isExpectingErrors())
      specRunner.runExpectingError();
    else
      specRunner.runWithNormalThen();

    return specRunner;
  }

  private runExpectingError(){
    let execClass = this.usedObject;
    let when = this.specContainer.getWhen();
    let thenThrow = this.specContainer.getThenThrow();
    let thrownError;
    let expectedError;

    this.runGiven();

    //run When
    try {
      execClass[when.getName()]();
    } catch (error){
      thrownError = error;
    }
    //run ThenThrow
    try {
      execClass[thenThrow.getName()]();
    } catch(error){
      expectedError = error
    }


    if(thrownError == null && expectedError != null){
      let errorReport =
        new AssertionError(thrownError, expectedError, AssertProportion.EQUAL,'thrown Error', 'expected Error',
          'No Error was thrown, expected "' + expectedError.message + '"');
      this.report.reportRun(thenThrow, false, errorReport);
      return;
    } else if(expectedError == null){
      this.report.reportValidationError(new SpecValidationError('@ThenThrow() of ' + this.specContainer.getClassName()+'.'+thenThrow.getName() + ' does not throw an error'));
    }else if(thrownError.message == expectedError.message){
      //compare Errors
      this.report.reportRun(when, true);
      this.report.reportRun(thenThrow, true);
    } else {
      this.report.reportRun(when, false, thrownError);
      let errorReport =
        new AssertionError(thrownError, expectedError, AssertProportion.EQUAL,'thrown Error', 'expected Error');
      this.report.reportRun(thenThrow, false, errorReport);
    }

  }

  private runWithNormalThen(){
    this.runGiven();
    this.runWhen();
    this.runThen();

  }

  private validateSpec():boolean{
    try{
      SpecValidator.validate(this.specContainer);
    } catch (error){
      if(error instanceof SpecValidationError) {
        this.report.reportValidationError(error);
        return false;
      }
      else
        throw error;
    }
    return true;
  }

  private runGiven() {
    let methodArray = this.specContainer.getGiven();
    methodArray.forEach((method: ISpecMethodContainer) => {
      this.runMethod(method);
    });
  }

  private runThen() {
    let methodArray = this.specContainer.getThen();
    methodArray.forEach((method: ISpecMethodContainer) => {
      this.runMethod(method);
    });
  }

  private runWhen() {
    this.runMethod(this.specContainer.getWhen())
  }

  private runMethod(method: ISpecMethodContainer){
    let execClass = this.usedObject;
    if(execClass[method.getName()] == null)
      throw Error('test-Runner method ' + method.getName() + ' not found on Class ' + this.specContainer.getClassName());
    try {
      execClass[method.getName()]();
    } catch (error) {
      if(error instanceof AssertionError) {
        this.report.reportRun(method, false, error);
      } else {
        throw error;
      }
      return;
    }

    this.report.reportRun(method, true);
  }

}
