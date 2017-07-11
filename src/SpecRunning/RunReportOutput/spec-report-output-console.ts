import {ISpecReportOutput} from "./iSpec-report-output";
import {ISpecReport} from "../specReporting/specReport/iSpec-report";
import {ISpecReporter} from "../specReporting/specReporter/iSpec-reporter";
import {SpecRunStatus} from "../specReporting/spec-run-status";
import {SpecReportSorter} from "../specReporting/reportSorter/spec-report-sorter";
import {ISpecMethodReport} from "../specReporting/specMethodReport/iSpec-method-report";
import {config} from '../../../testNext-config'

let style = config.specReportConsoleOutput.style;
let command = config.specReportConsoleOutput.commands;

/**
 * Output for Reported Data
 */
export class SpecReportOutputConsole implements ISpecReportOutput {

  private specReporter: ISpecReporter;
  private heading = null;

  private orderBy: OutputOrder = OutputOrder.ALPHABET;

  private sFailedOnly = true;
  private sNonExecutable = false;
  private hIgnored = false;

  /**
   * @param specReporter Reporter with Data to print
   */
  constructor(specReporter: ISpecReporter) {
    this.specReporter = specReporter;
  }

  /**
   * generate a new Output and print it into the console
   */
  outputResult() {
    if (this.heading != null)
      console.log(command.clearScreenStyle + style.heading + '\n' + this.heading + '\n' + command.resetStyle + '\n');
    //get topics
    let topics = this.specReporter.getTopics();
    //sort Topics by alphabet, no Topic at last
    topics = SpecReportOutputConsole.sortStringArrayByAlphabet(topics);

    let topicCount = topics.length;

    //for each topic
    topics.forEach(topic => {
      let reports = this.specReporter.getReportsOfTopic(topic);
      if (reports == null || reports.length == 0)
        return;
      let reportFiter = new SpecReportSorter(reports);

      if (this.sFailedOnly)
        reportFiter.removeSuccessful();
      if (!this.sNonExecutable)
        reportFiter.removeNonExecutable();
      if (this.hIgnored)
        reportFiter.removeIgnored();


      switch (this.orderBy) {
        case OutputOrder.ALPHABET:
          reportFiter.orderReportsByAlphabet();
          break;
        case OutputOrder.EXECUTION_STATUS:
          reportFiter.orderReportsByExecutionStatus();
          break;
        default:
          reportFiter.orderReportsByAlphabet();
      }


      let padding = 1;
      let remainingReports = reportFiter.getReports();

      if (remainingReports.length == 0) {
        return;
      } else if (topicCount === 1 && topic == null) {
        //if no topic at all is set: not padding and no subheading
        padding = 0;
      } else if (topic == null) {
        //replace "null" with '# Without Subject" in Subheading
        console.log(style.subHeading + '# Without Subject' + command.resetStyle);
      } else {
        //Topic as Subheading
        console.log(style.subHeading + topic + command.resetStyle);
      }

      //for each selected Report of the topic
      remainingReports.forEach(report => {
        this.printSpecReport(report, padding);
      });
      console.log('\n');
    });
  }

  /**
   * @param heading for the Spec-Report
   */
  setHeading(heading: string) {
    this.heading = heading;
  }


  /**
   * set if only failed Runs should be printed
   * @param val optional, only false as argument necessary
   */
  showFailedOnly(val?: boolean) {
    if (val == null || val)
      this.sFailedOnly = true;
    else
      this.sFailedOnly = false;
  }

  showNonExecutable(val?: boolean) {
    if (val == null)
      this.sNonExecutable = true;
    else
      this.sNonExecutable = val;
  }

  hideIgnored(val?: boolean) {
    if (val == null) {
      this.hIgnored = true;
      return;
    }
    this.hIgnored = val;
  }

  orderByExecutionStatus() {
    this.orderBy = OutputOrder.EXECUTION_STATUS
  }

  orderByAlphabet() {
    this.orderBy = OutputOrder.ALPHABET
  }


  /**
   * print a single Spec into the console
   * @param specReport
   * @param paddingNumber
   */
  private printSpecReport(specReport: ISpecReport, paddingNumber?: number) {

    if (paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportOutputConsole.getPaddingString(paddingNumber);

    let status = specReport.getRunStatus();

    this.logSpecDescription(specReport, padding);

    if (status == SpecRunStatus.IGNORED)
      this.logIgnored(specReport, padding);
    if (status == SpecRunStatus.NOT_EXECUTABLE)
      this.logNotExecutable(specReport, padding);
    if (status == SpecRunStatus.INVALID)
      this.logInvalid(specReport, padding);
    else {
      specReport.getMethodReports().forEach((methodReport) => {
        this.logSpecMethodReport(methodReport, padding);
      });
    }
  }


  private logSpecDescription(specReport: ISpecReport, padding?: string) {
    if (padding == null)
      padding = '';

    let description;
    if (specReport.getSpecDescription() != null)
      description = specReport.getSpecDescription() + ' (' + specReport.getSpecClassName() + ')';
    else
      description = specReport.getSpecClassName();

    console.log(
      '\n' +
      this.getColorFor(specReport.getRunStatus()) +
      padding +
      description +
      command.resetStyle
    );
  }

  private logIgnored(specReport: ISpecReport, padding?: string) {
    if (padding == null)
      padding = '';

    console.log(
      style.notExecuted +
      padding + '    ' +
      'IGNORED: ' + specReport.getIgnoreReason() +
      command.resetStyle
    );
  };

  private logNotExecutable(specReport: ISpecReport, padding?: string) {
    if (padding == null)
      padding = '';

    console.log(
      style.notExecuted,
      padding, '    ',
      'Not Executable',
      command.resetStyle
    );
  }

  private logInvalid(specReport: ISpecReport, padding?: string) {
    if (padding == null)
      padding = '';

    specReport.getValidationErrors().forEach((error) => {
      console.log(
        style.invalid +
        padding + ' I: ' +
        error.message +
        command.resetStyle
      );
    });
  }

  private logSpecMethodReport(specMethodReport: ISpecMethodReport, padding?: string) {
    if (padding == null)
      padding = '';

    if (specMethodReport.isSuccess()) {
      console.log(
        //this.getColorFor(SpecRunStatus.SUCCESSFUL),
        padding +
        '    ' +
        specMethodReport.getMethodType() + ' ' + specMethodReport.getDescription() +
        '(' + specMethodReport.getMethodName() + ')' +
        command.resetStyle
      );
    } else {
      console.log(
        this.getColorFor(SpecRunStatus.FAILED) +
        padding + ' X: ' +
        specMethodReport.getMethodType() + ' ' + specMethodReport.getDescription() +
        '(' + specMethodReport.getMethodName() + ')' +
        '\n' +
        padding + '    ' +
        specMethodReport.getError().message +
        command.resetStyle
      );
    }

  }


  private static getPaddingString(paddingNumber: Number): string {
    if (paddingNumber == null) return '';
    let padding = '';
    for (let i = 0; i < paddingNumber; i++) {
      padding += '  ';
    }
    return padding;
  }

  private getColorFor(runStatus: SpecRunStatus) {
    switch (runStatus) {
      case SpecRunStatus.IGNORED:
        return style.notExecuted;
      case SpecRunStatus.NOT_EXECUTABLE:
        return style.notExecuted;
      case SpecRunStatus.INVALID:
        return style.invalid;
      case SpecRunStatus.FAILED:
        return style.failedRun;
      case SpecRunStatus.SUCCESSFUL:
        return style.success;
    }
  }

  static sortStringArrayByAlphabet(array: String[]): String[] {
    return array.sort((a, b) => {
      if (a == null) return 1;
      if (b == null) return -1;
      else if (a.toLowerCase() < b.toLowerCase()) return -1;
      else if (a.toLowerCase() > b.toLowerCase()) return 1;
      else return 0;
    });
  }


}


enum OutputOrder {
  ALPHABET,
  EXECUTION_STATUS
}
