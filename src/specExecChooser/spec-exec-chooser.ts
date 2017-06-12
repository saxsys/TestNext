import {SpecReporter} from "../spec-run-reporter/spec-reporter";
import {SpecReportBeautyfier} from "../spec-run-reporter/spec-report-beautyfier";
import {specRegistry} from "../specRegistry/spec-registry-storage";
import {SpecRunner} from "../specRunner/spec-runner";
import {ISpecReport} from "../spec-run-reporter/spec-report-interfaces";

export class SpecExecChooser{

  private static successColor = '\x1b[1;32m';
  private static validErrorColor = '\x1b[1;33m';
  private static failedRunColor = '\x1b[1;31m';
  private static resetStyle = '\x1b[0m';
  private static topicHeading = '\x1b[47m\x1b[30m';

  static execAllSpecs(){


    let specReg = specRegistry.getRegistryEntries();
    let specReporter = new SpecReporter();

    specReg.forEach((spec) => {
      let specRunner = new SpecRunner(spec, specReporter);
      let specReport = specRunner.runSpec();
      SpecExecChooser.printSpecReport(specReport);
    });
  }

  static execBySubjects() {

    let specReporter = new SpecReporter();
    let subjects = specRegistry.getSubjects();

    subjects.forEach((subject) => {
      console.log(this.topicHeading + subject + this.resetStyle);
      let subjectSpecs = specRegistry.getSpecsForSubject(subject);
      subjectSpecs.forEach((spec) => {
        let existSpecReport = specReporter.getSpecReportOf(spec.getClassName());
        if(existSpecReport != null){
          SpecExecChooser.printSpecReport(existSpecReport, 3);

        } else {
          let specRunner = new SpecRunner(spec, specReporter);
          let specReport = specRunner.runSpec();
          SpecExecChooser.printSpecReport(specReport, 3);
        }
      });

    });

    let specWithoutSubject = specRegistry.getSpecsWithoutSubject();
    if(specWithoutSubject.length > 0)
      console.log(this.topicHeading + '#Without Subject' + this.resetStyle);
      specWithoutSubject.forEach((spec) => {
        let specRunner = new SpecRunner(spec, specReporter);
        let specReport = specRunner.runSpec();
        SpecExecChooser.printSpecReport(specReport, 3);
      });

  }

  static execSubject(subject: string){
    console.log(this.topicHeading + subject + this.resetStyle);
    let specs = specRegistry.getSpecsForSubject(subject);
    if(specs == null){
      console.log(this.validErrorColor + 'no Subject with Name "' + subject + '" found \n' +
        'we got: ' + specRegistry.getSubjects() + this.resetStyle
      );
      return;
    }

    let specLogger = new SpecReporter();
    specs.forEach((spec) => {
      let specRunner = new SpecRunner(spec, specLogger);
      let specReport = specRunner.runSpec();
      SpecExecChooser.printSpecReport(specReport, 3);
    });
  }

  static execSpec(className:string){
    let spec = specRegistry.getSpecByClassName(className);
    if(spec == null ){
      console.log( this.validErrorColor +'no SpecClasses with Name "' + className + '" found \n' +
        'we got: ' + specRegistry.getSpecClassNames() + this.resetStyle
      );
      return;
    }

    let specReporter = new SpecReporter();
    let specRunner = new SpecRunner(spec, specReporter);
    let specReport = specRunner.runSpec();

    let reportString = SpecReportBeautyfier.SpecReportToString(specReport);

    if(specReport.isInvalidSpec())
      console.log( this.validErrorColor +reportString + this.resetStyle);
    else if (specReport.isRunFailed())
      console.log( this.failedRunColor +reportString + this.resetStyle);
    else
      console.log(this.successColor + reportString + this.resetStyle);
  }

  private static printSpecReport(specReport:ISpecReport, paddingNumber?: number){
    if(paddingNumber == null) paddingNumber = 0;
    let reportString = SpecReportBeautyfier.SpecReportToString(specReport, paddingNumber);

    if(specReport.isInvalidSpec())
      console.log( this.validErrorColor +reportString + this.resetStyle);
    else if (specReport.isRunFailed())
      console.log( this.failedRunColor +reportString + this.resetStyle);
    else
      console.log(this.successColor + reportString + this.resetStyle);
  }

}
