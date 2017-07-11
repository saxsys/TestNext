import {SpecRunner} from "../specRunner/spec-runner";
import {ISpecReporter} from "../specReporting/specReporter/iSpec-reporter";
import {SpecRegistry} from "../../SpecStorage/specRegistry/spec-registry";

/**
 * Collection of methods applying run-configuration and executing Specs
 */
export class SpecExecChooser {

  /**
   * execute all Specs
   * @param specRegistry containing the Specs to run
   * @param specReporter for the Results of the Run
   */
  static execAllSpecs(specRegistry:SpecRegistry, specReporter: ISpecReporter) {
    let specs = specRegistry.getAllSpecContainer();

    specs.forEach((spec) => {
      SpecRunner.runSpec(spec, specReporter);
    });
  }

  /**
   * execute all Specs, and report them order by them into Subjects
   * @param specRegistry containing the Specs to run
   * @param specReporter for the Results of the Run
   */
  static execBySubjects(specRegistry:SpecRegistry, specReporter: ISpecReporter) {
    let subjects = specRegistry.getSubjects();

    //for each existing Subject
    subjects.forEach((subject) => {
      let subjectSpecs = specRegistry.getSpecContainersForSubject(subject);
      //For each Spec of the Subject
      subjectSpecs.forEach((spec) => {

        //If Spec was already run for other Subject just add the report to the subject-topic
        let existSpecReport = specReporter.getReportForSpec(spec.getClassName());
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
    let specWithoutSubject = specRegistry.getSpecContainersWithoutSubject();
    if (specWithoutSubject.length > 0)
      specWithoutSubject.forEach((spec) => {
        SpecRunner.runSpec(spec, specReporter);
      });
  }

  /**
   * exec all Specs of the Subject
   * @param specRegistry containing the Specs to run
   * @param specReporter for the Results of the Run
   * @param subject to run
   */
  static execSubject(specRegistry: SpecRegistry, specReporter: ISpecReporter, subject: string) {
    let specs = specRegistry.getSpecContainersForSubject(subject);
    if (specs == null) {
      throw new Error('No Subject with Name "' + subject + '" found\n' +
        'we got: ' + specRegistry.getSubjects());
    }
    specs.forEach((spec) => {
      let specRunner = SpecRunner.runSpec(spec, specReporter);
      specReporter.addReportToTopic(specRunner.report, subject);
    });
  }

  /**
   * exec one specific spec by the SpecClassName
   * @param specRegistry containing the Specs to run
   * @param specReporter for the Results of the Run
   * @param specClassName of the one Spec to run
   */
  static execSpec(specRegistry: SpecRegistry, specReporter: ISpecReporter, specClassName: string) {
    let spec = specRegistry.getSpecContainerByClassName(specClassName);
    if (spec == null) {
      throw new Error('No SpecClasses with Name "' + specClassName + '" found\n' +
        'we got: ' + specRegistry.getSpecClassNames());
    }

    SpecRunner.runSpec(spec, specReporter);
  }


}
