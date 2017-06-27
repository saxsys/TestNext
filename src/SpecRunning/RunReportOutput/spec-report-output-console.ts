import {ISpecReportOutput} from "./iSpec-report-output";
import {ISpecReport} from "../specRunReporter/iSpec-report";

export class SpecReportOutputConsole implements ISpecReportOutput {

  private successColor = '\x1b[1;32m';
  private validErrorColor = '\x1b[1;33m';
  private failedRunColor = '\x1b[1;31m';
  private resetStyle = '\x1b[0m';
  private topicHeading = '\x1b[47m\x1b[30m';
  private notExecutedColor = '\x1b[0;37m';

  private reportsByTopic = new Map<String, Array<ISpecReport>>();
  private failedOnly = false;

  showFailedOnly(val?: boolean) {
    if (val == null || val)
      this.failedOnly = true;
    else
      this.failedOnly = false;
  }

  addReport(report: ISpecReport, topic?: string) {
    let existReports = this.reportsByTopic.get(topic);
    if (existReports == null) {
      this.reportsByTopic.set(topic, [report]);
    } else {
      existReports.push(report);
    }
  }

  outputReport() {
    this.reportsByTopic.forEach((reports, topic) => {
      let padding = 0;
      if (topic != null) {
        this.printTopic(topic.toString());
        padding = 3;
      }
      reports.forEach((report) => {
        this.printSpecReport(report, padding);
      });
    });
  }

  private printTopic(topic: string) {
    console.log(this.topicHeading + topic + this.resetStyle);
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
