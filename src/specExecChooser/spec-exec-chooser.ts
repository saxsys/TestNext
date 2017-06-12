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

  static execAllSpecs(showFailedOnly?:boolean){


    let specReg = specRegistry.getRegistryEntries();
    let specReporter = new SpecReporter();

    specReg.forEach((spec) => {
      let specRunner = new SpecRunner(spec, specReporter);
      let specReport = specRunner.runSpec();
      SpecExecChooser.printSpecReport(specReport,0,showFailedOnly);
    });
  }

  static execBySubjects(showFailedOnly?:boolean) {

    let specReporter = new SpecReporter();
    let subjects = specRegistry.getSubjects();

    subjects.forEach((subject) => {
      console.log(this.topicHeading + subject + this.resetStyle);
      let subjectSpecs = specRegistry.getSpecsForSubject(subject);
      subjectSpecs.forEach((spec) => {
        let existSpecReport = specReporter.getSpecReportOf(spec.getClassName());
        if(existSpecReport != null){
          SpecExecChooser.printSpecReport(existSpecReport, 3, showFailedOnly);

        } else {
          let specRunner = new SpecRunner(spec, specReporter);
          let specReport = specRunner.runSpec();
          SpecExecChooser.printSpecReport(specReport, 3, showFailedOnly);
        }
      });

    });

    let specWithoutSubject = specRegistry.getSpecsWithoutSubject();
    if(specWithoutSubject.length > 0)
      console.log(this.topicHeading + '#Without Subject' + this.resetStyle);
      specWithoutSubject.forEach((spec) => {
        let specRunner = new SpecRunner(spec, specReporter);
        let specReport = specRunner.runSpec();
        SpecExecChooser.printSpecReport(specReport, 3, showFailedOnly);
      });

  }

  static execSubject(subject: string, showFailedOnly?:boolean){
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
      SpecExecChooser.printSpecReport(specReport, 3, showFailedOnly);
    });
  }

  static execSpec(className:string, showFailedOnly?:boolean){
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

    SpecExecChooser.printSpecReport(specReport, 0, showFailedOnly);
  }

  private static printSpecReport(specReport:ISpecReport, paddingNumber?: number, showFailedOnly?:boolean){
    if(paddingNumber == null) paddingNumber = 0;
    if(showFailedOnly == null) showFailedOnly = false;

    let reportString = SpecReportBeautyfier.SpecReportToString(specReport, paddingNumber);

    if(specReport.isInvalidSpec())
      console.log(this.validErrorColor + reportString + this.resetStyle);
    else if (specReport.isRunFailed())
      console.log(this.failedRunColor + reportString + this.resetStyle);
    else if(!showFailedOnly)
      console.log(this.successColor + reportString + this.resetStyle);
  }

}
