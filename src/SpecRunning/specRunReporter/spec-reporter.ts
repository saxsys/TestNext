import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecReport} from "./spec-report";
import {ISpecReporter} from "./iSpec-reporter";
import {ISpecReport} from "./iSpec-report";

export class SpecReporter implements ISpecReporter {

  private specReports = new Map<String, SpecReport>();


  getReports(): Array<ISpecReport> {
    return Array.from(this.specReports.values());
  }

  getSpecReportOf(className: string): ISpecReport {
    return this.specReports.get(className);
  }

  public getOrCreateSpecReport(spec: ISpecContainer): ISpecReport {
    let specReport = this.specReports.get(spec.getClassName());
    if (specReport != null && specReport.getSpec() != spec)
      throw new Error('SpecReporter cannot reportRun two classes with same Name');
    if (specReport == null) {
      specReport = new SpecReport(spec);
      this.specReports.set(spec.getClassName(), specReport);
    }

    return specReport;
  }

}




