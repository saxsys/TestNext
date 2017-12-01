import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecValidator} from "../specValidator/spec-validator";
import {AssertionError} from "../../SpecDeclaration/assert/assertion-Error";
import {SpecValidationError} from "../specValidator/spec-validation-error";
import {ISpecMethodContainer} from "../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {AssertProportion} from "../../SpecDeclaration/assert/assert-proportion";
import {ISpecReporter} from "../specReporting/specReporter/iSpec-reporter";
import {ISpecReport} from "../specReporting/specReport/iSpec-report";


/**
 * Class to execute a Spec (with SpecRunner.runSpec()), it contains the results of the run afterwards
 */
export class SpecRunner {

  /**
   * SpecContainer with the executed Spec
   */
  specContainer: ISpecContainer;

  /**
   * Object of the SpecClass, which was used in the run
   */
  usedObject:any;

  /**
   * report containing the results of the run
   */
  report:ISpecReport;

  /**
   * constructor for usage in runSpec only
   * @param spec
   * @param specReport
   */
  private constructor(spec:ISpecContainer, specReport:ISpecReport){
    this.specContainer = spec;
    this.report = specReport;
  }

  /**
   * Runs a Spec, after validating it
   * creates and returns a SpecRunner, containing results and run-data
   *
   * @param specContainer with the Spec to run
   * @param specReporter to report the run-result
   * @return {SpecRunner} containing the results of the run
   */
  static runSpec(specContainer:ISpecContainer, specReporter:ISpecReporter, useMock?: boolean): SpecRunner{
    let specReport = specReporter.getOrCreateSpecReport(specContainer);
    let specRunner = new SpecRunner(specContainer, specReport);

    if(specContainer.isIgnored()) {
      specReport.setIgnored(specContainer.getIgnoreReason());
      return specRunner;
    }
    if(!specContainer.isExecutableSpec()) {
     specReport.setNotExecutable();
      return specRunner;
    }


    if(!specRunner.validateSpec()) {
      specRunner.usedObject = null;
      return specRunner;
    }


    specRunner.usedObject =  specContainer.getNewSpecObject(useMock);

    specRunner.runAndLog();

    return specRunner;
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

  private runAndLog(){
    let when = this.specContainer.getWhen();
    let thenThrow = this.specContainer.getThenThrow();
    let thrownWhenError;
    let expectedWhenError;

    this.runGiven();

    thrownWhenError = this.runWhen();

    if(this.specContainer.isExpectingErrors()){
      expectedWhenError = this.runThenThrow();

      //Handle and thrown and expected Errors
      if(thrownWhenError == null && expectedWhenError != null){
        //No Error Thrown
        
        this.report.reportRun(when, true);
        
        let errorReport =
          new AssertionError(thrownWhenError, expectedWhenError, AssertProportion.EQUAL,'thrown Error', 'expected Error',
            'No Error was thrown, expected "' + expectedWhenError.message + '"');
        this.report.reportRun(thenThrow, false, errorReport);
        return;
      } else if(expectedWhenError == null){
        //ThenThrow did not throw an Error
        this.report.reportValidationError(new SpecValidationError('@ThenThrow() of ' + this.specContainer.getClassName()+'.'+thenThrow.getName() + ' does not throw an error'));
      }else if(thrownWhenError.message == expectedWhenError.message){
        //Thrown Error was expected
        this.report.reportRun(when, true);
        this.report.reportRun(thenThrow, true);
      } else {
        //Different Errors thrown than expected
        this.report.reportRun(when, false, thrownWhenError);
        let errorReport =
          new AssertionError(thrownWhenError, expectedWhenError, AssertProportion.EQUAL,'thrown Error', 'expected Error');
        this.report.reportRun(thenThrow, false, errorReport);
      }

    } else {
      if(thrownWhenError != null){
        //Error was thrown, but none was expected
        this.report.reportRun(when, false, thrownWhenError);
        this.specContainer.getThen().forEach((then) => {
          //log Thens as failed, do not run them
          this.report.reportRun(then, false, null);
        }) ;
      } else {
        this.report.reportRun(when, true);
        this.runThen();
      }
    }

    this.runCleanup();

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

  private runWhen():Error {
    try {
      this.usedObject[this.specContainer.getWhen().getName()]();
    } catch (error){
      return error;
    }
    return null;
  }

  private runThenThrow():Error{
    try {
      this.usedObject[this.specContainer.getThenThrow().getName()]();
    } catch (error){
      return error;
    }
    return null;
  }

  private runCleanup() {
    let methodArray = this.specContainer.getCleanup();
    methodArray.forEach((method: ISpecMethodContainer) => {
      this.runMethod(method);
    });
  }


  private runMethod(method: ISpecMethodContainer):Error{
    let execClass = this.usedObject;
    if(execClass[method.getName()] == null)
      throw Error('test-Runner method ' + method.getName() + ' not found on Class ' + this.specContainer.getClassName());
    try {
      execClass[method.getName()]();
    } catch (error) {
      this.report.reportRun(method, false, error);
      return error;
    }

    this.report.reportRun(method, true);

    return null;
  }

}
