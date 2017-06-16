import {ReflectiveInjector} from '@angular/core';

import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {ISpecReporter, ISpecReport} from "../specRunReporter/spec-report-interfaces";
import {SpecValidator} from "../specValidator/spec-validator";
import {AssertionError} from "../../SpecDeclaration/assert/assertion-Error";
import {SpecValidationError} from "../specValidator/spec-validation-error";
import {ISpecMethodContainer} from "../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecWithSUT} from "../../SpecDeclaration/spec/spec";
import {AssertProportion} from "../../SpecDeclaration/assert/assert-proportion";
import * as _ from "underscore";


export class SpecRunner {

  private specContainer: ISpecContainer;
  private specReport: ISpecReport;
  private specObject:any;

  constructor(spec:ISpecContainer, specReporter: ISpecReporter){
    this.specContainer = spec;
    this.specReport = specReporter.getOrCreateSpecReport(spec);
  }

  runSpec(otherReporter?:ISpecReporter): ISpecReport{
    if(otherReporter != null){
      this.specReport = otherReporter.getOrCreateSpecReport(this.specContainer)
    }
    if(this.specContainer.isIgnored()) {
      this.specReport.setIgnored(this.specContainer.getIgnoreReason());
      return this.specReport;
    }
    if(!this.specContainer.isExecutableSpec()) {
     this.specReport.setNotExecutable();
      return this.specReport;
    }

    let validity = this.validateSpec();

    if(!validity) {
      this.specObject = null;
      return this.specReport;
    }

    this.specObject =  this.specContainer.getNewSpecObject();

    if(this.specContainer.expectingErrors())
      this.runExpectingError();
    else
      this.runWithNormalThen();

    return this.specReport;
  }

  private runExpectingError(){
    let execClass = this.specObject;
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
    //compare Errors
    if(thrownError.message == expectedError.message){
      this.specReport.reportRun(when, true);
      this.specReport.reportRun(thenThrow, true);
    } else {
      this.specReport.reportRun(when, false, thrownError);
      let errorReport = new AssertionError(thrownError, expectedError, AssertProportion.EQUAL,'thrown Error', 'expected Error');
      this.specReport.reportRun(thenThrow, false, errorReport);
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
        this.specReport.reportValidationError(error);
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
    let execClass = this.specObject;
    if(execClass[method.getName()] == null)
      throw Error('test-Runner method ' + method.getName() + ' not found on Class ' + this.specContainer.getClassName());
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

  getSpec(): ISpecContainer{
    return this.specContainer;
  }

  getUsedSpecObject():any{
    return this.specObject;
  }
}
