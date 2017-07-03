import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecReport} from "./specReport/spec-report";
import {ISpecReporter} from "./iSpec-reporter";
import {ISpecReport} from "./specReport/iSpec-report";

/**
 * Collecting Reports for multiple Specs
 * and optionally assigning them to topics
 */
export class SpecReporter implements ISpecReporter {

  private specReports = new Map<String, ISpecReport>();
  private topicsAndReports = new Map<String, Array<string>>();

  /**
   * returns the Report for a Spec or creates a new one if it does not exist
   * cannot create a new Report for a name-duplicate Spec
   * @param specContainer SpecContainer for the Report to find or create
   * @return {ISpecReport} report of The Spec
   */
  getOrCreateSpecReport(specContainer: ISpecContainer): ISpecReport {
    let className = specContainer.getClassName();
    let specReport = this.specReports.get(className);

    //get or save Report
    if (specReport != null && specReport.getSpecContainer() != specContainer) {
      throw new Error('SpecReporter cannot add reports for multiple runs with same specClassName (' + className + ')');
    } else if (specReport == null) {
      specReport = new SpecReport(specContainer);
      this.specReports.set(className, specReport);
    }

    //mark report as not having a topic yet
    this.addReportToTopic(specReport, null);


    return specReport;
  }

  /**
   * @return {ISpecReport[]} Array of all registered Reports for Specs
   */
  getReports(): Array<ISpecReport> {
    return Array.from(this.specReports.values());
  }

  /**
   * get the Report for a Spec
   * @param specClassName Name of the Spec to find the report of
   * @return {ISpecReport}
   */
  getReportForSpec(specClassName: string): ISpecReport {
    return this.specReports.get(specClassName);
  }

  /**
   * add A Report to a Topic
   * multiple reports per topic are possible
   * multiple topics per report are possible
   * @param report
   * @param topic
   */
  addReportToTopic(report: ISpecReport, topic: String) {
    let reportName = report.getSpecContainer().getClassName();
    if (this.specReports.get(reportName) == null)
      throw new Error('Report for "' + reportName + '" does not exist in Reporter');
    //Remove report from reports without topic (topic == null)
    let reportsWithoutTopic = this.topicsAndReports.get(null);
    if (topic != null && reportsWithoutTopic != null && reportsWithoutTopic.includes(reportName)) {
      let index = reportsWithoutTopic.indexOf(reportName, 0);
      if (index > -1) {
        reportsWithoutTopic.splice(index, 1);
      }
      //remove , if empty
      if (reportsWithoutTopic.length == 0)
        this.topicsAndReports.delete(null);

    }

    //Add Element to Topic
    let reportsOfTopic = this.topicsAndReports.get(topic);
    if (reportsOfTopic == null) {
      reportsOfTopic = [reportName];
      this.topicsAndReports.set(topic, reportsOfTopic);
    } else {
      if (!reportsOfTopic.includes(reportName))
        reportsOfTopic.push(reportName);
    }
  }

  /**
   * get all Reports of a Topic
   *
   * @param topic in question (null for reports without topic)
   * @return {ISpecReport[]} Reports of the Topic
   */
  getReportsOfTopic(topic: String): Array<ISpecReport> {
    let reportNamesOfTopic = this.topicsAndReports.get(topic);
    if (reportNamesOfTopic == null)
      return null;

    let reports = [];
    reportNamesOfTopic.forEach(reportName => {
      reports.push(this.getReportForSpec(reportName));

    });
    return reports;

  }

  /**
   * @return {String[]} All Topics with Reports
   */
  getTopics(): Array<String> {
    return Array.from(this.topicsAndReports.keys());
  }

}




