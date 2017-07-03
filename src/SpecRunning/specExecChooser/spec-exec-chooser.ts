import {SpecRunner} from "../specRunner/spec-runner";
import {ISpecReporter} from "../specRunReporter/iSpec-reporter";
import {SpecRegistry} from "../../SpecStorage/specRegistry/spec-registry";

export class SpecExecChooser {

  static execAllSpecs(specRegistry:SpecRegistry, specReporter: ISpecReporter) {
    let specs = specRegistry.getAllSpecs();

    specs.forEach((spec) => {
      SpecRunner.runSpec(spec, specReporter);
    });
  }


  static execBySubjects(specRegistry:SpecRegistry, specReporter: ISpecReporter) {
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
          let specRunner = SpecRunner.runSpec(spec, specReporter);
          specReporter.addReportToTopic(specRunner.report, subject);
        }
      });
    });

    //run specs without subject
    let specWithoutSubject = specRegistry.getSpecsWithoutSubject();
    if (specWithoutSubject.length > 0)
      specWithoutSubject.forEach((spec) => {
        if(!spec.isExecutableSpec())
          return;
        SpecRunner.runSpec(spec, specReporter);
      });
  }


  static execSubject(specRegistry:SpecRegistry, subject: string, specReporter: ISpecReporter) {
    let specs = specRegistry.getSpecsForSubject(subject);
    if (specs == null) {
      throw new Error('No Subject with Name "' + subject + '" found\n' +
        'we got: ' + specRegistry.getSubjects());
    }
    specs.forEach((spec) => {
      let specRunner = SpecRunner.runSpec(spec, specReporter);
      specReporter.addReportToTopic(specRunner.report, subject);
    });
  }

  static execSpec(specRegistry:SpecRegistry, className: string, specReporter: ISpecReporter) {
    let spec = specRegistry.getSpecByClassName(className);
    if (spec == null) {
      throw new Error('No SpecClasses with Name "' + className + '" found\n' +
        'we got: ' + specRegistry.getSpecClassNames());
    }

    SpecRunner.runSpec(spec, specReporter);
  }


}
