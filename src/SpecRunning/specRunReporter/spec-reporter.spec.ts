import {SpecReporter} from "./spec-reporter";
import {ExampleSpecFiller} from '../../utils/testData/example-spec-filler';

describe('SpecReporter', () =>{

  let reporter;
  beforeAll(()=>{
    reporter = new SpecReporter();
  });

  it('should init without Arguments', ()=>{
    expect(reporter).not.toBeUndefined();
    expect(reporter).not.toBeNull();
  });

  it('should have an empty specReport', () => {
    let specReports = reporter.getReports();
    expect(specReports instanceof Array).toBeTruthy();
    expect(specReports.length).toBe(0);
  });

  it('should have an empty topic Array', ()=>{
    let topics = reporter.getTopics();
    expect(topics instanceof Array).toBeTruthy();
    expect(topics.length).toBe(0);
  });

});

describe('SpecReporter.getOrCreateSpecReport', () => {
  let reporter;
  let reportedSpec = ExampleSpecFiller.getStandardSpec();
  let existReport;
  beforeAll(()=>{
    reporter = new SpecReporter();
    existReport = reporter.getOrCreateSpecReport(reportedSpec);
  });

  it('should create the Report', () => {
    let report = reporter.getSpecReportOf(reportedSpec.getClassName());
    expect(report).not.toBeUndefined();
    expect(report).not.toBeNull();
    expect(report.getSpec()).toEqual(reportedSpec);
  });

  it('should refuse Class Name Duplicates', ()=>{
    let specNameDuplicate = ExampleSpecFiller.getSpecNameDoubleToStandardSpec();

    expect(() => {
      reporter.getOrCreateSpecReport(specNameDuplicate)
    }).toThrowError('SpecReporter cannot add reports for multiple runs with same specClassName (' + specNameDuplicate.getClassName() + ')');
  });

  it('should return an existing Report, if one for the Spec already exists', () => {
    let report = reporter.getOrCreateSpecReport(reportedSpec);
    expect(report).toEqual(existReport);
  });

  it('should create new Report for new Spec', () => {
    let otherSpec = ExampleSpecFiller.getSpecWithoutSubject();
    let otherReport = reporter.getOrCreateSpecReport(otherSpec);
    expect(otherReport).not.toBeNull();
    expect(otherReport.getSpec()).toEqual(otherSpec);
  });

  it('should add Reports to Topic "null" by default', ()=>{
    let reportsWithoutTopic = reporter.getReportsOfTopic(null);
    expect(reportsWithoutTopic).toContain(existReport);
  });

});

describe('SpecReporter.addReportToTopic', () => {
  let reporter;
  let reportedSpec = ExampleSpecFiller.getStandardSpec();
  let existReport;
  let otherSpec = ExampleSpecFiller.getSpecWithoutSubject();
  let otherReport;

  beforeAll(()=>{
    reporter = new SpecReporter();
    existReport = reporter.getOrCreateSpecReport(reportedSpec);
    otherReport = reporter.getOrCreateSpecReport(otherSpec);
  });

  it('should refuse, if Report des not exist', ()=>{
    let otherReporter = new SpecReporter();
    let nonExistReport = otherReporter.getOrCreateSpecReport(ExampleSpecFiller.getSpecWithSubjects());

    expect(()=> {
      reporter.addReportToTopic(nonExistReport, 'aTopic');
    }).toThrowError('Report for "' + nonExistReport.getSpec().getClassName() + '" does not exist in Reporter');
  });

  it('should add Report to Topic and remove from reports without topic', () => {
    let topicName = 'A Rather Good Topic';
    expect(reporter.getReportsOfTopic(null)).toContain(existReport, 'precondition failed, report was not saved as one without topic');
    expect(reporter.getReportsOfTopic(topicName)).not.toContain(existReport, 'precondition failed, report was was already in Topic');
    reporter.addReportToTopic(existReport, topicName);
    expect(reporter.getTopics()).toContain(topicName, 'new Topic not created');
    expect(reporter.getReportsOfTopic(topicName)).toContain(existReport, 'report not in new topic');
    expect(reporter.getReportsOfTopic(null)).not.toContain(existReport, 'report still in reports without topic');
  });

  it('should be able to have multiple topics per report', () => {
    let topic1 = 'topic1';
    let topic2 = 'topic2';

    reporter.addReportToTopic(otherReport, topic1);
    reporter.addReportToTopic(otherReport, topic2);

    expect(reporter.getReportsOfTopic(topic1)).toContain(otherReport, 'not added to 1st topic');
    expect(reporter.getReportsOfTopic(topic2)).toContain(otherReport, 'not added to 2nd topic');
  });

  it('should be able to have multiple reports per Topic', () => {
    let topicName = 'topic with Multiple Reports';
    reporter.addReportToTopic(existReport, topicName);
    reporter.addReportToTopic(otherReport, topicName);

    let reportsOfTopic = reporter.getReportsOfTopic(topicName);
    expect(reportsOfTopic).toContain(existReport, 'existReport not in topic');
    expect(reportsOfTopic).toContain(existReport, 'otherReport not in topic');
  });
});
