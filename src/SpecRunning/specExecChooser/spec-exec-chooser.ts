import {SpecReporter} from "../specRunReporter/spec-reporter";
import {specRegistry} from "../../SpecStorage/specRegistry/spec-registry-storage";
import {SpecRunner} from "../specRunner/spec-runner";
import {IRunReportOutput} from "../RunReportOutput/iRun-report-output";

export class SpecExecChooser {

  static execAllSpecs(reportOutput: IRunReportOutput) {
    let specReg = specRegistry.getExecutableSpecs();
    let specReporter = new SpecReporter();

    specReg.forEach((spec) => {
      let specRunner = new SpecRunner(spec, specReporter);
      let specReport = specRunner.runSpec();
      reportOutput.addReport(specReport);
    });
  }


  static execBySubjects(reportOutput: IRunReportOutput) {
    let specReporter = new SpecReporter();
    let subjects = specRegistry.getSubjects();

    subjects.forEach((subject) => {
      let subjectSpecs = specRegistry.getSpecsForSubject(subject);
      subjectSpecs.forEach((spec) => {
        let existSpecReport = specReporter.getSpecReportOf(spec.getClassName());
        if (existSpecReport != null) {
          reportOutput.addReport(existSpecReport, subject);
        } else {
          let specRunner = new SpecRunner(spec, specReporter);
          let specReport = specRunner.runSpec();
          reportOutput.addReport(specReport, subject);
        }
      });
    });

    let specWithoutSubject = specRegistry.getSpecsWithoutSubject();
    if (specWithoutSubject.length > 0)
      specWithoutSubject.forEach((spec) => {
        let specRunner = new SpecRunner(spec, specReporter);
        let specReport = specRunner.runSpec();
        reportOutput.addReport(specReport, '#Without Subject');
      });
  }


  static execSubject(subject: string, reportOutput: IRunReportOutput) {
    let specs = specRegistry.getSpecsForSubject(subject);
    if (specs == null)
      throw new Error('No Subject with Name "' + subject + '" found \n' +
        'we got: ' + specRegistry.getSubjects());

    let specLogger = new SpecReporter();
    specs.forEach((spec) => {
      let specRunner = new SpecRunner(spec, specLogger);
      let specReport = specRunner.runSpec();
      reportOutput.addReport(specReport, subject);
    });
  }

  static execSpec(className: string, reportOutput: IRunReportOutput) {
    let spec = specRegistry.getSpecByClassName(className);
    if (spec == null) {
      throw new Error('No SpecClasses with Name "' + className + '" found \n' +
        'we got: ' + specRegistry.getSpecClassNames());
    }

    let specReporter = new SpecReporter();
    let specRunner = new SpecRunner(spec, specReporter);
    let specReport = specRunner.runSpec();
    reportOutput.addReport(specReport);
  }


}
