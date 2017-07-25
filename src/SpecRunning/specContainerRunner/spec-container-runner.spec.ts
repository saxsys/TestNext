import {SpecRunner} from "./spec-container-runner";
import {ExampleSpecFiller} from "../../utils/testData/example-spec-filler";
import {SpecReport} from "../specReporting/specReport/spec-report";

describe('SpecRunner', ()=>{
  it('should init', ()=>{
    let spec = ExampleSpecFiller.getStandardSpec();
    let report = new SpecReport(spec);
    let specRunner = new SpecRunner(spec, report);

    expect(specRunner).not.toBeNull();
  });
});


describe('SpecRunner.createObject', ()=>{
  it('should validate Spec and report validationErrors, and not set the Object', ()=>{
    let spec = ExampleSpecFiller.getSpecWithoutGiven();
    let report = new SpecReport(spec);
    let specRunner = new SpecRunner(spec, report);
    expect(specRunner).not.toBeNull('init failed');
    expect(specRunner).not.toBeUndefined('init failed');

    let returnedObj = specRunner.createObject();
    expect(returnedObj).toBeNull();
    let valErrors = report.getValidationErrors();
    expect(valErrors.length).toBe(1);
    expect(returnedObj).toBeNull('should not have returned an object');
    expect(specRunner.getObject()).toBeNull('should not have set an object');
  });

  it('create an Object for proper Specs, return it and save it', ()=>{
    let spec = ExampleSpecFiller.getStandardSpec();
    let report = new SpecReport(spec);
    let specRunner = new SpecRunner(spec, report);
    expect(specRunner).not.toBeNull('init failed');
    expect(specRunner).not.toBeUndefined('init failed');

    let returnedObj = specRunner.createObject();
    expect(report.getValidationErrors().length).toBe(0, 'validation Errors existed');
    expect(returnedObj).not.toBeNull('returned null');
    expect(specRunner.getObject()).not.toBeNull('did not save Object');
    expect(specRunner.getObject()).toEqual(returnedObj, 'saved and returned different Objects');
  });

  it('should create Spec, having an SUT', ()=>{
    let spec = ExampleSpecFiller.getSpecWithSUT();
    let report = new SpecReport(spec);
    let specRunner = new SpecRunner(spec, report);
    expect(specRunner).not.toBeNull('init failed');
    expect(specRunner).not.toBeUndefined('init failed');

    let returnedObj = specRunner.createObject();
    expect(report.getValidationErrors().length).toBe(0, 'validation Errors existed');
    expect(returnedObj).not.toBeNull('returned null');
    expect(specRunner.getObject()).not.toBeNull('did not save Object');
    expect(specRunner.getObject()).toEqual(returnedObj, 'saved and returned different Objects');
    expect(returnedObj.SUT).not.toBeUndefined('SUT undefined');
    expect(returnedObj.SUT).not.toBeNull('SUT null');

  });

  it('should log a Validation Error for a Spec with SUT, When not all Providers are given', ()=>{
    let spec = ExampleSpecFiller.getSpecWithFailingSUT();
    let report = new SpecReport(spec);
    let specRunner = new SpecRunner(spec, report);
    expect(specRunner).not.toBeNull('init failed');
    expect(specRunner).not.toBeUndefined('init failed');

    let returnedObj = specRunner.createObject();
    expect(returnedObj).toBeNull('should not have created Object');
    expect(specRunner.getObject()).toBeNull('should not have saved an Object');

    let valErrors = report.getValidationErrors();
    expect(valErrors.length).toBe(1, 'validation Errors existed');
    expect(valErrors[0].message).toMatch(new RegExp('Cannot resolve all parameters *'));

  });
});
