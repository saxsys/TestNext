import {ISpecReportOutput} from "./iSpec-report-output";
import {ISpecReport} from "../specRunReporter/iSpec-report";
import {ISpecReporter} from "../specRunReporter/iSpec-reporter";

export class SpecReportOutputConsole implements ISpecReportOutput {
  private successColor = '\x1b[1;32m';
  private validErrorColor = '\x1b[1;33m';
  private failedRunColor = '\x1b[1;31m';
  private resetStyle = '\x1b[0m';
  private topicHeading = '\x1b[47m\x1b[30m';
  private notExecutedColor = '\x1b[0;37m';

  private failedOnly = false;
  private specReporter:ISpecReporter;

  constructor(specReporter: ISpecReporter){
    this.specReporter = specReporter;
  }

  showFailedOnly(val?: boolean) {
    if (val == null || val)
      this.failedOnly = true;
    else
      this.failedOnly = false;
  }

  outputReport(){
    let topics = this.specReporter.getTopics();

    topics.forEach(topic => {
      let padding = 0;
      if(topic != null) {
        console.log(this.topicHeading + topic + this.resetStyle);
        padding = 3;
      }

      let reports = this.specReporter.getReportsOfTopic(topic);
      reports.forEach(report => {
        this.printSpecReport(report, padding);
      });
    });
  }


  private printSpecReport(specReport: ISpecReport, paddingNumber?: number) {
    if (paddingNumber == null) paddingNumber = 0;

    let reportString = specReport.getStringBeautified(paddingNumber);
    if (specReport.isIgnored() || !specReport.isExecutable())
      console.log(this.notExecutedColor + reportString + this.resetStyle);
    else if (specReport.isInvalidSpec())
      console.log(this.validErrorColor + reportString + this.resetStyle);
    else if (specReport.isRunFailed())
      console.log(this.failedRunColor + reportString + this.resetStyle);
    else if (this.failedOnly)
      console.log(this.successColor + reportString + this.resetStyle);
  }

}
