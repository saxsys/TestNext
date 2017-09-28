import {SpecExecChooser} from "./spec-exec-chooser";
import {SpecRegistry} from "../../SpecStorage/specRegistry/spec-registry";
import {SpecReporter} from "../specReporting/specReporter/spec-reporter";
import {ExampleRegistryFiller} from "../../utils/testData/example-registry-filler";

describe('SpecExecChooser.execAllSpecs', () => {

  it('should not fail, when registry is empty', () => {
    let registry = new SpecRegistry();
    let reporter = new SpecReporter();

    SpecExecChooser.execAllSpecs(registry, reporter);

    expect(reporter.getReports().length).toBe(0);
  });

  it('should also log Ignored Specs', () => {
    let registry = new SpecRegistry();
    ExampleRegistryFiller.addIgnoredSpecTo(registry);

    let reporter = new SpecReporter();

    expect(() => {
      SpecExecChooser.execAllSpecs(registry, reporter);
    }).not.toThrow();

    let reports = reporter.getReports();
    expect(reports.length).toBe(1);
    let reportOfIgnored = reports[0];
    expect(reportOfIgnored.isIgnored()).toBeTruthy();

  });

  it('should also log for not executable Specs', () => {
    let registry = new SpecRegistry();
    ExampleRegistryFiller.addNonExecutableSpecTo(registry);

    let reporter = new SpecReporter();

    SpecExecChooser.execAllSpecs(registry, reporter);

    let reports = reporter.getReports();
    expect(reports.length).toBe(1, 'not logged for notExecutableSpec');
    let nonExReport = reports[0];
    expect(nonExReport.isExecutable()).toBeFalsy('non Executable Report not marked as nonExecutable');
  });

  it('should run multiple reports', () => {
    let registry = new SpecRegistry();

    let standardSpec = ExampleRegistryFiller.addStandardSpecTo(registry);
    let inheritedSpec = ExampleRegistryFiller.addInheritedSpecTo(registry);
    let specWithSubject = ExampleRegistryFiller.addSpecWithSubjectsTo(registry);
    let specWithoutGiven = ExampleRegistryFiller.addSpecWithoutGivenTo(registry);

    let reporter = new SpecReporter();

    SpecExecChooser.execAllSpecs(registry, reporter);

    let reports = reporter.getReports();
    expect(reports.length).toBe(registry.getAllSpecContainer().length, 'number of reports differ from number of registered Specs');

    let reportStandardSpec = reporter.getReportForSpec(standardSpec.getClassName());
    let reportInheritedSpec = reporter.getReportForSpec(inheritedSpec.getClassName());
    let reportWithSubject = reporter.getReportForSpec(specWithSubject.getClassName());
    let reportWithoutGiven = reporter.getReportForSpec(specWithoutGiven.getClassName());
    expect(reportStandardSpec).not.toBeNull('StandardTest not logged');
    expect(reportInheritedSpec).not.toBeNull('StandardTest not logged');
    expect(reportWithSubject).not.toBeNull('SpecWithSubject not logged');
    expect(reportWithoutGiven).not.toBeNull('SpecWithoutGiven not logged');

    let topics = reporter.getTopics();
    expect(topics.length).toBe(1, 'topics created which should not be');
    expect(topics[0]).toEqual(null, 'topic with Name created');


  });

  it('should use real Implementation of Generated Dependencies by default', ()=>{
    let registry = new SpecRegistry();
    let specWithGenerate = ExampleRegistryFiller.addSpecWithGenerateTo(registry);
    let reporter = new SpecReporter();

    SpecExecChooser.execAllSpecs(registry, reporter);
    let reports = reporter.getReports();
    expect(reports.length).toBe(registry.getAllSpecContainer().length, 'number of reports differ from number of registered Specs');
    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did not use Mock', 'did Use Mock');
  });

  it('should use Mock of Generated Dependencies, when given', ()=>{
    let registry = new SpecRegistry();
    let specWithGenerate = ExampleRegistryFiller.addSpecWithGenerateTo(registry);
    let reporter = new SpecReporter();

    SpecExecChooser.execAllSpecs(registry, reporter, true);
    let reports = reporter.getReports();
    expect(reports.length).toBe(registry.getAllSpecContainer().length, 'number of reports differ from number of registered Specs');
    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did use Mock instead of Real', 'did not Use Mock');
  });
});

describe('SpecExecChooser.runSpec', () => {

  let registry = new SpecRegistry();

  let standardSpec = ExampleRegistryFiller.addStandardSpecTo(registry);
  let inheritedSpec = ExampleRegistryFiller.addInheritedSpecTo(registry);
  let specWithSubject = ExampleRegistryFiller.addSpecWithSubjectsTo(registry);
  let specWithoutGiven = ExampleRegistryFiller.addSpecWithoutGivenTo(registry);
  let nonExecSpec = ExampleRegistryFiller.addNonExecutableSpecTo(registry);
  let ignoredSpec = ExampleRegistryFiller.addIgnoredSpecTo(registry);

  it('should throw Error, when spec does not exist in Registry', () => {
    let reporter = new SpecReporter();

    expect(() => {
      SpecExecChooser.execSpec(registry, reporter, 'NonExistingSpecName');
    }).toThrowError(
      new RegExp('No SpecClasses with Name "NonExistingSpecName" found\nwe got: *'));
  });

  it('should accept standardSpec', () => {
    let reporter = new SpecReporter();
    SpecExecChooser.execSpec(registry, reporter, standardSpec.getClassName());
    let reports = reporter.getReports();
    expect(reports.length).toBe(1);

    let topics = reporter.getTopics();
    expect(topics.length).toBe(1, 'topics created which should not be');
    expect(topics[0]).toEqual(null, 'topic with Name created');
  });

  it('should accept Ignored Specs', () => {

    let reporter = new SpecReporter();

    SpecExecChooser.execSpec(registry, reporter, ignoredSpec.getClassName());

    let reports = reporter.getReports();
    expect(reports.length).toBe(1);

    let topics = reporter.getTopics();
    expect(topics.length).toBe(1, 'topics created which should not be');
    expect(topics[0]).toEqual(null, 'topic with Name created');

  });

  it('should accept not executable Specs', () => {

    let reporter = new SpecReporter();
    SpecExecChooser.execSpec(registry, reporter, nonExecSpec.getClassName());

    let reports = reporter.getReports();
    expect(reports.length).toBe(1, 'not logged for notExecutableSpec');
    let topics = reporter.getTopics();
    expect(topics.length).toBe(1, 'topics created which should not be');
    expect(topics[0]).toEqual(null, 'topic with Name created');
  });

  it('should for Inherited Specs only use the child', () => {
    let reporter = new SpecReporter();
    SpecExecChooser.execSpec(registry, reporter, inheritedSpec.getClassName());

    let reports = reporter.getReports();
    expect(reports.length).toBe(1);
    let topics = reporter.getTopics();
    expect(topics.length).toBe(1, 'topics created which should not be');
    expect(topics[0]).toEqual(null, 'topic with Name created');
  });

  it('should report subjects, even for Specs with Subject', () => {
    let reporter = new SpecReporter();
    SpecExecChooser.execSpec(registry, reporter, specWithSubject.getClassName());

    let topics = reporter.getTopics();
    expect(topics.length).toBe(1, 'topics created which should not be');
    expect(topics[0]).toEqual(null, 'topic with Name created');
  })

  it('should use real Implementation of Generated Dependencies by default', ()=>{
    let registry = new SpecRegistry();
    let specWithGenerate = ExampleRegistryFiller.addSpecWithGenerateTo(registry);
    let reporter = new SpecReporter();

    SpecExecChooser.execSpec(registry, reporter, specWithGenerate.getClassName());

    let reports = reporter.getReports();
    expect(reports.length).toBe(1, 'number of reports differ from number of registered Specs');
    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did not use Mock', 'did Use Mock');
  });

  it('should use Mock of Generated Dependencies, when given', ()=>{
    let registry = new SpecRegistry();
    let specWithGenerate = ExampleRegistryFiller.addSpecWithGenerateTo(registry);
    let reporter = new SpecReporter();

    SpecExecChooser.execSpec(registry, reporter, specWithGenerate.getClassName(), true);

    let reports = reporter.getReports();
    expect(reports.length).toBe(registry.getAllSpecContainer().length, 'number of reports differ from number of registered Specs');
    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did use Mock instead of Real', 'did not Use Mock');
  });
});

describe('SpecExecChooser.execSubject', () => {
  let registry = new SpecRegistry();

  let specWithSubject = ExampleRegistryFiller.addSpecWithSubjectsTo(registry);
  let standardSpec = ExampleRegistryFiller.addStandardSpecTo(registry);
  let specWithoutSubject = ExampleRegistryFiller.addSpecWithoutSubjectTo(registry);
  let specWithGenerate = ExampleRegistryFiller.addSpecWithGenerateTo(registry);

  let subjectNameUsedOnce = 'SubjectNameUsedOnce';
  let subjectUsedMultipleTimes = 'SubjectUsedMultipleTimes';

  beforeAll(()=>{
    registry.registerSpecForSubject(specWithSubject.getClassConstructor(), subjectNameUsedOnce);
    registry.registerSpecForSubject(specWithSubject.getClassConstructor(), subjectUsedMultipleTimes);
    registry.registerSpecForSubject(standardSpec.getClassConstructor(), subjectUsedMultipleTimes);
    registry.registerSpecForSubject(specWithGenerate.getClassConstructor(), subjectUsedMultipleTimes);
  });

  it('should throw an Error for non existent Subjects', () => {
    let reporter = new SpecReporter();

    expect(() => {
      SpecExecChooser. execSubject(registry, reporter, 'NonExistentSubject');
    }).toThrowError(
      new RegExp('No Subject with Name "NonExistentSubject" found\nwe got: *')
    );
  });

  it('should save Spec into a topic for a Subject used once', () => {
    let reporter = new SpecReporter();

    SpecExecChooser.execSubject(registry, reporter, subjectNameUsedOnce);

    let reports = reporter.getReports();

    expect(reports.length).toBeGreaterThanOrEqual(1);

    let topics = reporter.getTopics();
    expect(topics.length).toBe(1);
    expect(topics[0]).toEqual(subjectNameUsedOnce);

    let specsOfTopic = reporter.getReportsOfTopic(subjectNameUsedOnce);
    expect(specsOfTopic.length).toBe(1);
  });

  it('should save Spec into a topic for a Subject used multiple times', () => {
    let reporter = new SpecReporter();

    SpecExecChooser.execSubject(registry, reporter, subjectUsedMultipleTimes);

    let reports = reporter.getReports();

    expect(reports.length).toBeGreaterThanOrEqual(3);

    let topics = reporter.getTopics();
    expect(topics.length).toBe(1);
    expect(topics[0]).toEqual(subjectUsedMultipleTimes);

    let specsOfTopic = reporter.getReportsOfTopic(subjectUsedMultipleTimes);
    expect(specsOfTopic.length).toBe(3);
  });

  it('should use real Implementation of Generated Dependencies by default', ()=>{
    let reporter = new SpecReporter();

    SpecExecChooser.execSubject(registry, reporter, subjectUsedMultipleTimes);

    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did not use Mock', 'did Use Mock');
  });

  it('should use Mock of Generated Dependencies, when given', ()=>{

    let reporter = new SpecReporter();

    SpecExecChooser.execSubject(registry, reporter, subjectUsedMultipleTimes, true);

    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did use Mock instead of Real', 'did not Use Mock');
  });
});

describe('SpecExecChooser.execAllSubjects', () => {
  let registry = new SpecRegistry();

  let specWithSubject = ExampleRegistryFiller.addSpecWithSubjectsTo(registry);
  let standardSpec = ExampleRegistryFiller.addStandardSpecTo(registry);
  let specWithoutSubject = ExampleRegistryFiller.addSpecWithoutSubjectTo(registry);
  let specWithGenerate = ExampleRegistryFiller.addSpecWithGenerateTo(registry);

  let subjectNameUsedOnce = 'SubjectNameUsedOnce';
  let subjectUsedMultipleTimes = 'SubjectUsedMultipleTimes';

  beforeAll(()=>{
    registry.registerSpecForSubject(specWithSubject.getClassConstructor(), subjectNameUsedOnce);
    registry.registerSpecForSubject(specWithSubject.getClassConstructor(), subjectUsedMultipleTimes);
    registry.registerSpecForSubject(standardSpec.getClassConstructor(), subjectUsedMultipleTimes);
    registry.registerSpecForSubject(specWithGenerate.getClassConstructor(), subjectUsedMultipleTimes);
  });

  it('should accept an empty registry', () => {
    let registry = new SpecRegistry();
    let reporter = new SpecReporter();
    expect(() => {
      SpecExecChooser.execAllSubjects(registry, reporter);
    }).not.toThrowError();
  });

  it('should execute a Spec only once, even if it appears in multiple Subjects, but report it in both topics', ()=>{
    class ExecChooser_ClassWithMultipleSubjectsCountingCalls{
      static execCount = 0;
      incrExecCount(){ExecChooser_ClassWithMultipleSubjectsCountingCalls.execCount++}
      when(){}
      then(){}
    }

    let specClassConstructor = ExecChooser_ClassWithMultipleSubjectsCountingCalls.prototype.constructor;
    let subjectName1 = 'One Subject proof Spec Executed Once';
    let subjectName2 = 'Other Subject proof Spec Executed Once';


    let registry = new SpecRegistry();
    registry.registerSpec(specClassConstructor, 'ExecChooser_ClassWithMultipleSubjectsCountingCalls');
    registry.registerGivenForSpec(specClassConstructor, 'incrExecCount', 'increment the Counter');
    registry.registerWhenForSpec(specClassConstructor, 'when', 'When');
    registry.registerThenForSpec(specClassConstructor, 'then', 'Then');

    registry.registerSpecForSubject(specClassConstructor, subjectName1);
    registry.registerSpecForSubject(specClassConstructor, subjectName2);


    let reporter = new SpecReporter();
    SpecExecChooser.execAllSubjects(registry, reporter);
    let reports = reporter.getReports();

    expect(reports.length).toBe(1);
    let topics = reporter.getTopics();
    expect(topics.length).toBe(2);
    expect(topics).toContain(subjectName1);
    expect(topics).toContain(subjectName2);

    let reportsOfSubject1 = reporter.getReportsOfTopic(subjectName1);
    expect(reportsOfSubject1.length).toBe(1, 'reports for Subject1');
    let reportsOfSubject2 = reporter.getReportsOfTopic(subjectName2);
    expect(reportsOfSubject2.length).toBe(1, 'reports for Subject2');

    expect(reportsOfSubject1[0]).toEqual(reportsOfSubject2[0], 'referenced Report of the 2 Subjects is not the same');

    expect(ExecChooser_ClassWithMultipleSubjectsCountingCalls.execCount).toBe(1, 'Spec wit Multiple Subjects not executed exactly once');



  });

  it('should report all topics', () => {
    let reporter = new SpecReporter();
    SpecExecChooser.execAllSubjects(registry, reporter);

    let topics = reporter.getTopics();
    let topicsToContain = registry.getSubjects().concat([null]).sort();

    expect(topics.sort()).toEqual(topicsToContain, 'did not execute expected Subjects');

  });

  it('should execute all specs with subject and report into their topics', () =>{
    let reporter = new SpecReporter();
    SpecExecChooser.execAllSubjects(registry, reporter);

    registry.getSubjects().forEach(subject => {
      let specsNamesOfSubject = registry.getSpecContainersForSubject(subject).map((spec)=>{
          return spec.getClassName();
        });
      let specsNamesOfTopic = reporter.getReportsOfTopic(subject).map((report)=>{
        return report.getSpecContainer().getClassName()
      });

      expect(specsNamesOfTopic.sort()).toEqual(specsNamesOfSubject.sort());
    })
  });

  it('should als execute Specs without Subject and save into topic "null"', () =>{
    let reporter = new SpecReporter();
    SpecExecChooser.execAllSubjects(registry, reporter);

    let specWithoutSubject = registry.getSpecContainersWithoutSubject().map((spec)=>{
      return spec.getClassName();
    });

    let specWithoutTopic = reporter.getReportsOfTopic(null).map((report)=>{
      return report.getSpecContainer().getClassName();
    });
    expect(specWithoutTopic.sort()).toEqual(specWithoutSubject.sort());
  });

  it('should use real Implementation of Generated Dependencies by default, for Specs with Subject', ()=>{
    let reporter = new SpecReporter();

    SpecExecChooser.execAllSubjects(registry, reporter);

    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did not use Mock', 'did Use Mock');
  });

  it('should use Mock of Generated Dependencies, when given, for Specs with Subject', ()=>{

    let reporter = new SpecReporter();

    SpecExecChooser.execAllSubjects(registry, reporter,true);

    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did use Mock instead of Real', 'did not Use Mock');
  });

  it('should use real Implementation of Generated Dependencies by default for Specs without Subject', ()=>{
    let registry = new SpecRegistry();
    ExampleRegistryFiller.addSpecWithGenerateTo(registry);

    let reporter = new SpecReporter();

    SpecExecChooser.execAllSubjects(registry, reporter);

    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did not use Mock', 'did Use Mock');
  });

  it('should use Mock of Generated Dependencies, when given, for Specs without Subject', ()=>{
    let registry = new SpecRegistry();
    ExampleRegistryFiller.addSpecWithGenerateTo(registry);

    let reporter = new SpecReporter();

    SpecExecChooser.execAllSubjects(registry, reporter,true);

    let reportForGenerate = reporter.getReportForSpec(specWithGenerate.getClassName());
    expect(reportForGenerate).not.toBeNull('For Generate not logged');
    let failReports = reportForGenerate.getFailReports();
    expect(failReports.length).toBe(1, 'not 1 Fail Report as expected');
    expect(failReports[0].getDescription()).toEqual('did use Mock instead of Real', 'did not Use Mock');
  });

});
