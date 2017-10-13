/**
 * Interface to create any output of Spec-Run-Reports
 */
export interface ISpecReportOutput{
  /**
   * print the Spec-Run-Report, the output-destination
   */
  outputResult();

  /**
   * set weather only the the failed reports should be printed
   * @param {boolean} val (if not set it is seen as true)
   */
  showFailedOnly(val?:boolean);
}
