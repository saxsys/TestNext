import {SpecReporter} from "../spec-run-logger/spec-reporter";
import {SpecReportBeautyfier} from "../spec-run-logger/spec-report-beautyfier";
import {SpecRegistry} from "../specRegistry/spec-registry";
import {SpecRunner} from "../specRunner/spec-runner";

export class SpecExecChooser{

  private static successColor = '\x1b[1;32m';
  private static validErrorColor = '\x1b[1;33m';
  private static failedRunColor = '\x1b[1;31m';
  private static resetStyle = '\x1b[0m';
  private static topicHeading = '\x1b[47m\x1b[30m';

  static execAllSpecs(){


    let specReg = SpecRegistry.getRegistryEntries();
    let specReporter = new SpecReporter();

    specReg.forEach((spec) => {
      let specRunner = new SpecRunner(spec, specReporter);
      let specReport = specRunner.runSpec();

      let reportString = SpecReportBeautyfier.SpecReportToString(specReport);

      if(specReport.isInvalidSpec())
        console.log(this.validErrorColor + reportString + this.resetStyle);
      else if (specReport.isRunFailed())
        console.log(this.failedRunColor + reportString + this.resetStyle);
      else
        console.log(this.successColor + reportString);
    });
  }

  static execBySubjects() {
    let SpecLogger = new SpecReporter();
    let subjects = SpecRegistry.getSubjects();

    subjects.forEach((subject) => {
      SpecExecChooser.execSubject(subject);
    });
  }

  static execSubject(subject: string){
    console.log(this.topicHeading + subject + this.resetStyle);
    let specs = SpecRegistry.getSpecsForSubject(subject);
    if(specs == null){
      console.log(this.validErrorColor + 'no Subject with Name "' + subject + '" found \n' +
        'we got: ' + SpecRegistry.getSubjects() + this.resetStyle
      );
      return;
    }

    let specLogger = new SpecReporter();
    specs.forEach((spec) => {
      let specRunner = new SpecRunner(spec, specLogger);
      let specReport = specRunner.runSpec();
      let reportString = SpecReportBeautyfier.SpecReportToString(specReport, 3);

      if(specReport.isInvalidSpec())
        console.log( this.validErrorColor +reportString + this.resetStyle);
      else if (specReport.isRunFailed())
        console.log( this.failedRunColor +reportString + this.resetStyle);
      else
        console.log(this.successColor + reportString + this.resetStyle);
    });
  }

  static execSpec(className:string){
    let spec = SpecRegistry.getSpecByClassName(className);
    if(spec == null ){
      console.log( this.validErrorColor +'no SpecClasses with Name "' + className + '" found \n' +
        'we got: ' + SpecRegistry.getSpecClassNames() + this.resetStyle
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



}
