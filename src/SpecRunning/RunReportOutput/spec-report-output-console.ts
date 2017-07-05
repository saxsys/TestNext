import {ISpecReportOutput} from "./iSpec-report-output";
import {ISpecReport} from "../specReporting/specReport/iSpec-report";
import {ISpecReporter} from "../specReporting/specReporter/iSpec-reporter";
import {SpecReportBeautifier} from "./spec-report-beautifier";
import {SpecRunStatus} from "../specReporting/spec-run-status";
import {config} from './spec-console-config'
import {SpecReportSorter} from "../specReporting/reportSorter/spec-report-sorter";

var style = config.specReportConsoleOutput.style;
var command = config.specReportConsoleOutput.commands;

/**
 * Output for Reported Data
 */
export class SpecReportOutputConsole implements ISpecReportOutput {

  private specReporter:ISpecReporter;
  private heading = null;

  private orderBy:OutputOrder = OutputOrder.ALPHABET;

  private sFailedOnly = true;
  private sNonExecutable = false;
  private hIgnored = false;

  /**
   * @param specReporter Reporter with Data to print
   */
  constructor(specReporter: ISpecReporter){
    this.specReporter = specReporter;
  }

  /**
   * generate a new Output and print it into the console
   */
  outputResult(){
    if(this.heading != null)
      console.log(command.clearScreenStyle + style.heading + '\n' + this.heading + '\n' + command.resetStyle  + '\n');
    //get topics
    let topics = this.specReporter.getTopics();
    //sort Topics by alphabet, no Topic at last
    topics = SpecReportOutputConsole.sortStringArrayByAlphabet(topics);

    let topicCount = topics.length;

    //for each topic
    topics.forEach(topic => {
      let reports = this.specReporter.getReportsOfTopic(topic);
      if(reports == null || reports.length == 0)
        return;
      console.log('before:', reports.length);
      let reportFiter = new SpecReportSorter(reports);
      console.log('in Filter:' + reportFiter.getReports().length);

      if(this.sFailedOnly)
        reportFiter.removeSuccessful();
      if(!this.sNonExecutable)
        reportFiter.removeNonExecutable();
      if(this.hIgnored)
        reportFiter.removeIgnored();

      console.log('after Filter:' + reportFiter.getReports().length);

      switch (this.orderBy ) {
        case OutputOrder.ALPHABET:
          reportFiter.orderReportsByAlphabet();
          break;
        case OutputOrder.EXECUTION_STATUS:
          reportFiter.orderReportsByExecutionStatus();
          break;
        default:
          reportFiter.orderReportsByAlphabet();
      }

      console.log('after sort:' + reportFiter.getReports().length);

      let padding = 1;
      let remainingReports = reportFiter.getReports();

      if(remainingReports.length == 0){
        return;
      } else if(topicCount === 1 && topic == null) {
        //if no topic at all is set: not padding and no subheading
        padding = 0;
      } else if(topic == null){
        //replace "null" with '# Without Subject" in Subheading
        console.log(style.subHeading + '# Without Subject'+ command.resetStyle);
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
  setHeading(heading:string){
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

  showNonExecutable(val?:boolean){
    if(val = null)
      this.sNonExecutable = true;
    else
      this.sNonExecutable = val;
  }

  hideIgnored(val?:boolean){
    if(val = null){
      this.hIgnored = true;
      return;
    }
    this.hIgnored = val;
  }

  orderByExecutionStatus(){
    this.orderBy = OutputOrder.EXECUTION_STATUS
  }

  orderByAlphabet(){
    this.orderBy = OutputOrder.ALPHABET
  }

  /**
   * print a single Spec into the console
   * @param specReport
   * @param paddingNumber
   */
  private printSpecReport(specReport: ISpecReport, paddingNumber?: number) {
    if (paddingNumber == null) paddingNumber = 0;

    let status = specReport.getRunStatus();
    let color = this.getColorFor(status);

    let description = this.getSpecDescription(specReport);

    console.log(color+description+command.resetStyle);
    let reportString = SpecReportBeautifier.SpecReportToString(specReport, paddingNumber);

    /*
    if (specReport.isIgnored() || !specReport.isExecutable())
      console.log(style.notExecuted + reportString + command.resetStyle);
    else if (specReport.isInvalidSpec())
      console.log(style.invalid + reportString + command.resetStyle);
    else if (specReport.isRunFailed())
      console.log(style.failedRun + reportString + command.resetStyle);
    else if (this.sFailedOnly)
      console.log(style.success + reportString + command.resetStyle);
     */
  }


  private getSpecDescription(specReport:ISpecReport):string{
    if(specReport.getSpecDescription() != null)
      return specReport.getSpecDescription() + ' (' + specReport.getSpecClassName() + ')';
    else
      return specReport.getSpecClassName();
  }

  private getColorFor(runStatus:SpecRunStatus){
    switch (runStatus){
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

  static sortStringArrayByAlphabet(array:String[]):String[]{
    return array.sort((a, b) => {
      if(a == null) return 1;
      if(b == null) return -1;
      else if(a.toLowerCase() < b.toLowerCase()) return -1;
      else if(a.toLowerCase() > b.toLowerCase()) return 1;
      else return 0;
    });
  }


}



enum OutputOrder {
  ALPHABET,
  EXECUTION_STATUS
}
