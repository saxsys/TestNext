import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecReport} from "./spec-report";
import {ISpecReporter} from "./iSpec-reporter";
import {ISpecReport} from "./iSpec-report";

export class SpecReporter implements ISpecReporter {



  private specReports = new Map<String, ISpecReport>();
  private topicsAndReports = new Map<String, Array<string>>();

  addReportToTopic(report:ISpecReport, topic:String){
    let reportName = report.getSpec().getClassName();
    //Remove report from reports without topic (topic == null)
    let reportsWithoutTopic = this.topicsAndReports.get(null);
    if(topic!= null && reportsWithoutTopic != null && reportsWithoutTopic.includes(reportName)){
      let index = reportsWithoutTopic.indexOf(reportName, 0);
      if (index > -1) {
        reportsWithoutTopic.splice(index, 1);
      }
    }

    //Add Element to Topic
    let reportsOfTopic = this.topicsAndReports.get(topic);
    if(reportsOfTopic == null) {
      reportsOfTopic = [reportName];
      this.topicsAndReports.set(topic, reportsOfTopic);
    } else{
      if(!reportsOfTopic.includes(reportName))
        reportsOfTopic.push(reportName);
    }
  }

  addReport(report: ISpecReport, topic?:string) {
    let className = report.getSpec().getClassName();
    if(this.specReports.get(className) != null)
      throw new Error('SpecReporter cannot add reports for multiple classes with same Name (' + className + ')');
    this.specReports.set(className, report);
    this.addReportToTopic(report, topic);
  }

  getReportsOfTopic(topic:String):Array<ISpecReport>{
    let reportNamesOfTopic = this.topicsAndReports.get(topic);
    if(reportNamesOfTopic == null)
      return [];

    let reports = [];
    reportNamesOfTopic.forEach(reportName => {
      reports.push(this.getSpecReportOf(reportName));

    });
    return reports;

  }

  getReports(): Array<ISpecReport> {
    return Array.from(this.specReports.values());
  }

  getSpecReportOf(className: string): ISpecReport {
    return this.specReports.get(className);
  }

  getTopics(): Array<String> {
    return Array.from(this.topicsAndReports.keys());
  }

  public getOrCreateSpecReport(spec: ISpecContainer, topic?:string): ISpecReport {
    let className = spec.getClassName();
    let specReport = this.specReports.get(className);
    if (specReport != null && specReport.getSpec() != spec)
      throw new Error('SpecReporter cannot add reports for multiple classes with same Name (' + className + ')');
    if (specReport == null) {
      specReport = new SpecReport(spec);
      this.specReports.set(className, specReport);
    }
    if(!this.topicsAndReports.get(topic).includes(className)){
      this.addReportToTopic(specReport, topic);
    }
    return specReport;
  }

}




