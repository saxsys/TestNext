
import {ISpecReport} from "../specRunReporter/iSpec-report";
export interface ISpecReportOutput{
  outputReport();
  showFailedOnly(val?:boolean);
}
