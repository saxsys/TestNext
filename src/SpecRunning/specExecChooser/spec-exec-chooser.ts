import {SpecReporter} from "../specRunReporter/spec-reporter";
import {specRegistry} from "../../SpecStorage/specRegistry/spec-registry-storage";
import {SpecRunner} from "../specRunner/spec-runner";
import {ISpecReporter} from "../specRunReporter/iSpec-reporter";

export class SpecExecChooser {

  static execAllSpecs(specReporter: ISpecReporter) {
    let specReg = specRegistry.getExecutableSpecs();

    specReg.forEach((spec) => {
      let specRunner = SpecRunner.runSpec(spec);
      specReporter.addReport(specRunner.report);
    });
  }


  static execBySubjects(specReporter: SpecReporter) {
    let subjects = specRegistry.getSubjects();

    //for each existing Subject
    subjects.forEach((subject) => {
      let subjectSpecs = specRegistry.getSpecsForSubject(subject);
      //For each Spec of the Subject
      subjectSpecs.forEach((spec) => {
        //If Spec was already run for other Subject just add the report to the subject-topic
        let existSpecReport = specReporter.getSpecReportOf(spec.getClassName());
        if (existSpecReport != null) {
          specReporter.addReportToTopic(existSpecReport, subject)
        } else {
          //if spec is not already run, run it and add it to the subject-topic
          let specRunner = SpecRunner.runSpec(spec);
          specReporter.addReport(specRunner.report, subject);
        }
      });
    });

    //run specs without subject
    let specWithoutSubject = specRegistry.getSpecsWithoutSubject();
    if (specWithoutSubject.length > 0)
      specWithoutSubject.forEach((spec) => {
        let specRunner = SpecRunner.runSpec(spec);
        specReporter.addReport(specRunner.report);
      });
  }


  static execSubject(subject: string, specReporter: ISpecReporter) {
    let specs = specRegistry.getSpecsForSubject(subject);
    if (specs == null)
      throw new Error('No Subject with Name "' + subject + '" found \n' +
        'we got: ' + specRegistry.getSubjects());

    let specLogger = new SpecReporter();
    specs.forEach((spec) => {
      let specRunner = SpecRunner.runSpec(spec);
      specReporter.addReport(specRunner.report, subject);
    });
  }

  static execSpec(className: string, specReporter: ISpecReporter) {
    let spec = specRegistry.getSpecByClassName(className);
    if (spec == null) {
      throw new Error('No SpecClasses with Name "' + className + '" found \n' +
        'we got: ' + specRegistry.getSpecClassNames());
    }

    let specRunner = SpecRunner.runSpec(spec);
    specReporter.addReport(specRunner.report);
  }


}
