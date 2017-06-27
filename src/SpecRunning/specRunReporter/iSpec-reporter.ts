import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {ISpecReport} from "./iSpec-report";

export interface ISpecReporter {
  getReports(): Array<ISpecReport>;
  getSpecReportOf(className:string):ISpecReport;
  getOrCreateSpecReport(spec:ISpecContainer):ISpecReport;
}
