import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {ISpecReport} from "./specReport/iSpec-report";

export interface ISpecReporter {
  getReports(): Array<ISpecReport>;
  getSpecReportOf(className:string):ISpecReport;
  getOrCreateSpecReport(spec:ISpecContainer):ISpecReport;
  addReportToTopic(report:ISpecReport, topic:String);
  getReportsOfTopic(topic:String):Array<ISpecReport>;
  getTopics():Array<String>;
}
