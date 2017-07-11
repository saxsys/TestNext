import {ISpecContainer} from "../../../SpecStorage/specContainer/iSpec-Container";
import {ISpecReport} from "../specReport/iSpec-report";
import {SpecReportStatistic} from "./spec-report-statistic";

/**
 * Collecting Reports for multiple Specs
 * and optionally assigning them to topics
 */
export interface ISpecReporter {

  /**
   * returns the Report for a Spec or creates a new one if it does not exist
   * cannot create a new Report for a name-duplicate Spec
   * @param specContainer SpecContainer for the Report to find or create
   * @return {ISpecReport} report of The Spec
   */
  getOrCreateSpecReport(spec: ISpecContainer): ISpecReport;

  /**
   * @return {ISpecReport[]} Array of all registered Reports for Specs
   */
  getReports(): Array<ISpecReport>;

  /**
   * get the Report for a Spec
   * @param specClassName Name of the Spec to find the report of
   * @return {ISpecReport}
   */
  getReportForSpec(className: string): ISpecReport;

  /**
   * add A Report to a Topic
   * multiple reports per topic are possible
   * multiple topics per report are possible
   * @param report
   * @param topic
   */
  addReportToTopic(report: ISpecReport, topic: String);

  /**
   * get all Reports of a Topic
   *
   * @param topic in question (null for reports without topic)
   * @return {ISpecReport[]} Reports of the Topic
   */
  getReportsOfTopic(topic: String): Array<ISpecReport>;

  /**
   * @return {String[]} All Topics with Reports
   */
  getTopics(): Array<String>;

  /**
   * Statistic for SpecRuns
   * @return {SpecReportStatistic}
   */
  getStatistic(): SpecReportStatistic;
}
