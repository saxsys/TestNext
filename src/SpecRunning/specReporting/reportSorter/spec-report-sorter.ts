
import {ISpecReport} from "../specReport/iSpec-report";
import {SpecRunStatus} from "../spec-run-status";

/**
 * Class to sort and filter an Array of SpecReports
 */
export class SpecReportSorter{

  private reports:Array<ISpecReport>;
  private remainingReports:Array<ISpecReport>;

  /**
   * Create a Report Sorter
   * @param {Array<ISpecReport>} List of SpecReports which should be filtered and sorted
   */
  constructor(reports:Array<ISpecReport>){
    this.reports = reports;
    this.remainingReports = reports;
  }

  /**
   * returns all remaining Reports, sorted as adjusted
   * @return {Array<ISpecReport>}
   */
  getReports():Array<ISpecReport>{
    return this.remainingReports;
  }

  /**
   * filter Reports for Specs which are marked as non executable
   * @return {SpecReportSorter} to apply the next filter/sorter on
   */
  removeNonExecutable():SpecReportSorter{
    let remaining = [];
    this.remainingReports.forEach((report)=> {
      if(report.isExecutable())
        remaining.push(report);
    });
    this.remainingReports = remaining;
    return this;
  }

  /**
   * filter Reports for Specs which are marked as non ignored
   * @return {SpecReportSorter} to apply the next filter/sorter on
   */
  removeIgnored():SpecReportSorter{
    let remaining = [];
    this.remainingReports.forEach((report)=> {
      if(!report.isIgnored())
        remaining.push(report);
    });
    this.remainingReports = remaining;
    return this;
  }

  /**
   * reset all filters and restart with the original Array of SpecReports
   * @return {SpecReportSorter} to apply the next filter/sorter on
   */
  resetFilter():SpecReportSorter{
    this.remainingReports = this.reports;
    return this;
  }

  /**
   * filter Reports for successful executed Specs
   * @return {SpecReportSorter} to apply the next filter/sorter on
   */
  removeSuccessful():SpecReportSorter{
    let remaining = [];
    this.remainingReports.forEach((report)=> {
      if(report.isRunFailed() || report.isInvalidSpec())
        remaining.push(report);
    });
    this.remainingReports = remaining;
    return this;
  }

  /**
   * filter Reports for filed executed Spec
   * @return {SpecReportSorter} to apply the next filter/sorter on
   */
  removeFailed():SpecReportSorter{
    let remaining = [];
    this.remainingReports.forEach((report)=> {
      if(!report.isRunFailed())
        remaining.push(report);
    });
    this.remainingReports = remaining;
    return this;
  }
  /**
   * sort Reports by the state of Spec execution (successs, failes, invalid,...)
   * @return {SpecReportSorter} to apply the next filter/sorter on
   */
  orderReportsByExecutionStatus():SpecReportSorter{
    this.remainingReports = SpecReportSorter.orderReportsByExecutionStatus(this.remainingReports);
    return this;
  }

  /**
   * Order Reports by alphabet of the SpecClass Name
   * @return {SpecReportSorter}
   */
  orderReportsByAlphabet():SpecReportSorter{
    this.remainingReports = SpecReportSorter.orderReportsByAlphabet(this.remainingReports);
    return this;
  }

  /**
   * static function to sort Reports by the state of Spec execution (successs, failes, invalid,...)
   * @param {ISpecReport[]} reports
   * @return {ISpecReport[]} Array of sorted
   */
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

  /**
   * static function to sort Reports by the name of the Spec Class
   * @param {ISpecReport[]} reports
   * @return {ISpecReport[]} Array of sorted
   */
  static orderReportsByAlphabet(reports:ISpecReport[]):ISpecReport[]{
    return reports.sort((a,b) => {
      if(a.getSpecClassName().toLowerCase() < b.getSpecClassName().toLowerCase()) return -1;
      else if(a.getSpecClassName().toLowerCase() > b.getSpecClassName().toLowerCase()) return 1;
      else return 0;
    });
  }


}
