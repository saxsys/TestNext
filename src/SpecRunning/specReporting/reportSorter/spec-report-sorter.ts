
import {ISpecReport} from "../specReport/iSpec-report";
import {SpecRunStatus} from "../spec-run-status";
export class SpecReportSorter{

  private reports:Array<ISpecReport>;
  private remainingReports:Array<ISpecReport>;

  constructor(reports:Array<ISpecReport>){
    this.reports = reports;
    this.remainingReports = reports;
  }


  getReports():Array<ISpecReport>{
    return this.remainingReports;
  }

  removeNonExecutable():SpecReportSorter{
    let remaining = [];
    this.remainingReports.forEach((report)=> {
      if(report.isExecutable())
        remaining.push(report);
    });
    this.remainingReports = remaining;
    return this;
  }

  removeIgnored():SpecReportSorter{
    let remaining = [];
    this.remainingReports.forEach((report)=> {
      if(!report.isIgnored())
        remaining.push(report);
    });
    this.remainingReports = remaining;
    return this;
  }

  resetFilter():SpecReportSorter{
    this.remainingReports = this.reports;
    return this;
  }

  removeSuccessful():SpecReportSorter{
    let remaining = [];
    this.remainingReports.forEach((report)=> {
      if(report.isRunFailed() || report.isInvalidSpec())
        remaining.push(report);
    });
    this.remainingReports = remaining;
    return this;
  }

  removeFailed():SpecReportSorter{
    let remaining = [];
    this.remainingReports.forEach((report)=> {
      if(!report.isRunFailed())
        remaining.push(report);
    });
    this.remainingReports = remaining;
    return this;
  }

  orderReportsByExecutionStatus():SpecReportSorter{
    this.remainingReports = SpecReportSorter.orderReportsByExecutionStatus(this.remainingReports);
    return this;
  }

  orderReportsByAlphabet():SpecReportSorter{
    this.remainingReports = SpecReportSorter.orderReportsByAlphabet(this.remainingReports);
    return this;
  }

  static orderReportsByExecutionStatus(reports:ISpecReport[]):ISpecReport[]{
    let sorted = [];

    let ignored = [];
    let notExecutable = [];
    let invalid = [];
    let failed = [];
    let success = [];

    reports.forEach(report =>{
      let status = report.getRunStatus();

      switch (status){
        case SpecRunStatus.IGNORED:
          ignored.push(report);
          break;
        case SpecRunStatus.NOT_EXECUTABLE:
          notExecutable.push(report);
          break;
        case SpecRunStatus.INVALID:
          invalid.push(report);
          break;
        case SpecRunStatus.FAILED:
          failed.push(report);
          break;
        case SpecRunStatus.SUCCESSFUL:
          success.push(report);
          break;
      }

    });

    failed = SpecReportSorter.orderReportsByAlphabet(failed);
    invalid = SpecReportSorter.orderReportsByAlphabet(invalid);
    success = SpecReportSorter.orderReportsByAlphabet(success);
    ignored = SpecReportSorter.orderReportsByAlphabet(ignored);
    notExecutable = SpecReportSorter.orderReportsByAlphabet(notExecutable);

    return sorted.concat(failed, invalid, success, ignored, notExecutable);
  }

  static orderReportsByAlphabet(reports:ISpecReport[]):ISpecReport[]{
    return reports.sort((a,b) => {
      if(a.getSpecClassName().toLowerCase() < b.getSpecClassName().toLowerCase()) return -1;
      else if(a.getSpecClassName().toLowerCase() > b.getSpecClassName().toLowerCase()) return 1;
      else return 0;
    });
  }


}
