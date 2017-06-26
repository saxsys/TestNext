import {ISpecReport} from "../specRunReporter/spec-report-interfaces";

export interface IRunReportOutput{
  outputReport();
  showFailedOnly(val?:boolean);
  addReport(report:ISpecReport, topic?:string);
}
