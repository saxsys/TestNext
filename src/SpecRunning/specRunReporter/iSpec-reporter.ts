import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {ISpecReport} from "./iSpec-report";

export interface ISpecReporter {
  getReports(): Array<ISpecReport>;
  getSpecReportOf(className:string):ISpecReport;
  addReport(report:ISpecReport, topic?:string);
  getOrCreateSpecReport(spec:ISpecContainer):ISpecReport;
  addReportToTopic(report:ISpecReport, topic:String);
  getReportsOfTopic(topic:String):Array<ISpecReport>;
  getTopics():Array<String>;
}
