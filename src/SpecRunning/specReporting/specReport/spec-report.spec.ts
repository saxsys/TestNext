import {ExampleSpecFiller} from '../../../utils/testData/example-spec-filler';
import {SpecReport} from "./spec-report";
import {SpecValidationError} from "../../specValidator/spec-validation-error";


describe('SpecReport', () => {
  let report;
  let spec;

  beforeAll(() => {
    spec = ExampleSpecFiller.getStandardSpec();
    report = new SpecReport(spec);
  });

  it('should init', () => {
    expect(report).not.toBeUndefined();
    expect(report).not.toBeNull();
  });

  it('should save the Spec', () => {
    expect(report.getSpecContainer()).toEqual(spec);
  });
  it('should not be ignored by default', () => {
    expect(report.isIgnored()).toBeFalsy();
    expect(report.getIgnoreReason()).toBeNull();
  });
  it('should be executable by default', () => {
    expect(report.isExecutable()).toBeTruthy();
  });
});

describe('SpecReport.getReportsForMethodName', () => {
  let report;
  let spec = ExampleSpecFiller.getStandardSpec();
  let methodNames = ['someGivenStuff', 'moreSetStuff', 'triggerStuff'];

  let singleError = new Error('sinle Error');
  let oneOtherError = new Error('other Error');
  let thirdError = new Error('thrid Error');
  beforeAll(() => {
    report = new SpecReport(spec);
    report.reportRun(spec.getOwnMethod(methodNames[0]), true);

    report.reportRun(spec.getOwnMethod(methodNames[1]), false, singleError);

    report.reportRun(spec.getOwnMethod(methodNames[2]), true);
    report.reportRun(spec.getOwnMethod(methodNames[2]), true);
  });

  it('should return [] if no report with name exists', () =>{
    let returnedReports = report.getReportsForMethodName('nonExistName');
    expect(returnedReports).not.toBeNull('return is numm');
    expect(returnedReports instanceof Array).toBeTruthy('return is not an Array');
    expect(returnedReports.length).toBe(0, 'length not 0');
  });

  it('should return one methodReport, if one exists', () => {
    let returnedReports = report.getReportsForMethodName(methodNames[0]);
    expect(returnedReports.length).toBe(1);
    let theOneReport = returnedReports[0];
    expect(theOneReport.getMethodName()).toEqual(methodNames[0]);
    expect(theOneReport.isSuccess()).toBeTruthy();
    expect(theOneReport.getError()).toBeUndefined();
  });

  it('should return reports with error', () =>{
    let returnedReports = report.getReportsForMethodName(methodNames[1]);
    expect(returnedReports.length).toBe(1);
    let theOneReport = returnedReports[0];
    expect(theOneReport.getMethodName()).toEqual(methodNames[1]);
    expect(theOneReport.isSuccess()).toBeFalsy();
    expect(theOneReport.getError()).toEqual(singleError);
  });


  it('should return multiple methodReport, if multiple exists', () => {
    let returnedReports = report.getReportsForMethodName(methodNames[2]);
    expect(returnedReports.length).toBe(2);
  });


});

describe('SpecReport.getFailReports', () => {
  let report;
  let spec = ExampleSpecFiller.getStandardSpec();
  let methodNames = ['someGivenStuff', 'moreSetStuff', 'triggerStuff'];

  let singleError = new Error('sinle Error');
  let oneOtherError = new Error('other Error');
  let thirdError = new Error('thrid Error');
  beforeAll(() => {
    report = new SpecReport(spec);
    report.reportRun(spec.getOwnMethod(methodNames[0]), true);

    report.reportRun(spec.getOwnMethod(methodNames[1]), false, singleError);

    report.reportRun(spec.getOwnMethod(methodNames[2]), false, oneOtherError);
    report.reportRun(spec.getOwnMethod(methodNames[2]), false, thirdError);
  });

  it('should return [], if no failed Reports exist', () => {
    let report = new SpecReport(spec);
    report.reportRun(spec.getOwnMethod(methodNames[0]), true);
    expect(report.getMethodReports().length).toBe(1, 'Precondition successful report exists');

    let failedReports = report.getFailReports();
    expect(failedReports instanceof Array).toBeTruthy('returned no Array');
    expect(failedReports.length).toBe(0, 'returned report as failed, which should not exists');
  });

  it('should return failed report', () => {
    let failedReports = report.getFailReports();
    expect(failedReports.length).toBe(3, 'wrong amount of fail-reports returned');
    let methodNames = failedReports.map((mReport) => {return mReport.getMethodName()});
    expect(methodNames.sort()).toEqual(['moreSetStuff', 'triggerStuff', 'triggerStuff'].sort());
  });

});

describe('SpecReport.ValidationErrors', () => {
  let report;
  let spec = ExampleSpecFiller.getStandardSpec();
  let methodNames = ['someGivenStuff', 'moreSetStuff', 'triggerStuff'];

  let oneError = new SpecValidationError('one Error');
  let otherError = new SpecValidationError('other Error');

  beforeAll(() => {
    report = new SpecReport(spec);
    report.reportValidationError(oneError);
    report.reportValidationError(otherError);


  });

  it('should make InsInvalidSpecReturn false, if there is no validation Error', () => {
    let report = new SpecReport(spec);
    expect(report.isInvalidSpec()).toBeFalsy();
  });

  it('should return an empty Array, if no Validation Errors exist', () => {
    let report = new SpecReport(spec);
    let valErrors = report.getValidationErrors();
    expect(valErrors instanceof  Array).toBeTruthy();
    expect(valErrors.length).toBe(0);
  });

  it('should return ValidationErrors, if some exist', () => {
    let valErrors = report.getValidationErrors();
    expect(valErrors instanceof Array).toBeTruthy();
    expect(valErrors.length).toBe(2);
    expect(valErrors).toContain(oneError);
    expect(valErrors).toContain(otherError);
  })

});
