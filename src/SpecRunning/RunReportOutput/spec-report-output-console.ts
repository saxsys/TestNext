import {ISpecReportOutput} from "./iSpec-report-output";
import {ISpecReport} from "../specRunReporter/specReport/iSpec-report";
import {ISpecReporter} from "../specRunReporter/iSpec-reporter";
import {SpecReportBeautifier} from "./spec-report-beautifier";

/**
 * Output for Reported Data
 */
export class SpecReportOutputConsole implements ISpecReportOutput {
  private successColor = '\x1b[1;32m';
  private validErrorColor = '\x1b[1;33m';
  private failedRunColor = '\x1b[1;31m';
  private notExecutedColor = '\x1b[0;37m';

  private clearScreenStyle = '\x1b[2J\x1b[1;1H';

  private headingStyle = '\x1b[47;4;30m';//\x1b[1m\x1b[4m\x1b[47m\x1b[30m
  private subHeadingStyle = '\x1b[47;30m';

  private resetStyle = '\x1b[0m';



  private failedOnly = false;
  private specReporter:ISpecReporter;
  private heading = null;

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
      console.log(this.clearScreenStyle + this.headingStyle + '\n' + this.heading + '\n' + this.resetStyle  + '\n');
    //get topics
    let topics = this.specReporter.getTopics();
    //sort Topics by alphabet, no Topic at last
    topics = topics.sort((a, b) => {
      if(a == null) return 1;
      if(b == null) return -1;
      else if(a.toUpperCase() == b.toUpperCase()) return 0;
      else if(a.toUpperCase() > b.toUpperCase()) return 1;
      else return -1;
    });

    let topicCount = topics.length;

    //for each topic
    topics.forEach(topic => {
      let padding = 3;


      if(topicCount === 1 && topic == null) {
        //if no topic at all is set: not padding and no subheading
        padding = 0;
      } else if(topic == null){
        //replace "null" with '# Without Subject" in Subheading
        console.log(this.subHeadingStyle + '# Without Subject'+ this.resetStyle);
      } else {
        //Topic as Subheading
        console.log(this.subHeadingStyle + topic + this.resetStyle);
      }

      //for each Reoport of the topic
      let reports = this.specReporter.getReportsOfTopic(topic);
      reports.forEach(report => {
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
      this.failedOnly = true;
    else
      this.failedOnly = false;
  }

  /**
   * print a single Spec into the console
   * @param specReport
   * @param paddingNumber
   */
  private printSpecReport(specReport: ISpecReport, paddingNumber?: number) {
    if (paddingNumber == null) paddingNumber = 0;

    let reportString = SpecReportBeautifier.SpecReportToString(specReport, paddingNumber);
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
