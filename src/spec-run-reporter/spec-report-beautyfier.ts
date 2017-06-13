import {ISpecReport, ISpecMethodRunReport} from "./spec-report-interfaces";
import {ISpec, ISpecMethod} from "../spec/ISpec";
import {SpecValidationError} from "../specRunner/specValidator/spec-validation-error";
export class SpecReportBeautyfier {

  private static paddingSymb = ' ';

  public static SpecReportToString(specReport:ISpecReport, paddingNumber?: number):string{
    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautyfier.getPaddingString(paddingNumber);

    let str = '';
    let spec = specReport.getSpec();
    let validationErrors = specReport.getValidationErrors();
    let runErrors = specReport.getFailReports();

    str += padding + SpecReportBeautyfier.specDescriptionToString(spec) + '\n';

    str += SpecReportBeautyfier.stringFromValidationErrors(validationErrors, (paddingNumber+1)*2);

    specReport. getReports().forEach((log) => {
      str += SpecReportBeautyfier.specMethodReportToString(log, (paddingNumber+1)*2) + '\n';
    });

    return str;
  }

  private static specMethodReportToString(specMethodRunReport: ISpecMethodRunReport, paddingNumber?: number): string {
    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautyfier.getPaddingString(paddingNumber);

    let str = '';
    str += padding + (specMethodRunReport.isSuccess() ? '' : 'FAILED : ') + SpecReportBeautyfier.specMethodToString(specMethodRunReport.getSpecMethod(), 0);
    if(specMethodRunReport.getError() != null)
      str += '\n' + padding + '         '+ specMethodRunReport.getError().message;

    return str;
  }

  private static specMethodToString(specMethod: ISpecMethod, paddingNumber?: number): string {
    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautyfier.getPaddingString(paddingNumber);

    return padding + specMethod.getMethodType().toString() + ' ' + specMethod.getDescription() + ' (' + specMethod.getName() + ')';
  }

  private static specDescriptionToString(spec: ISpec):string{
    if(spec.getDescription() !== ''){
      return spec.getDescription() + ' (' + spec.getClassName() + ')';
    } else {
      return spec.getClassName();
    }
  }

  private static stringFromValidationErrors(errors:Array<SpecValidationError>, paddingNumber?:number):string{
    if(errors.length == 0)
      return '';

    let retStr = '';

    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautyfier.getPaddingString(paddingNumber);

    retStr +=
            padding + ' ____________________________________\n' +
            padding + '| VALIDATION-ERRORS: ' + errors.length + '               |\n';
    errors.forEach((error) => {
      retStr += padding + '| ' + error.message + '\n';
    });
    retStr += padding + '|____________________________________|\n';
    return retStr;
  }

  private static getPaddingString(paddingNumber:Number):string{
    if(paddingNumber == null) return '';
    let padding = '';
    for (let i = 0; i < paddingNumber; i++) {
      padding += SpecReportBeautyfier.paddingSymb;
    }
    return padding;
  }

}
