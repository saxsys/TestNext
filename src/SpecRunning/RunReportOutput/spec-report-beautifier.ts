import {SpecValidationError} from "../specValidator/spec-validation-error";
import {ISpecReport} from "../specReporting/specReport/iSpec-report";
import {ISpecMethodReport} from "../specReporting/specMethodReport/iSpec-method-report";

export class SpecReportBeautifier {

  private static paddingSymb = '  ';

  public static SpecReportToString(specReport:ISpecReport, paddingNumber?: number):string{
    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautifier.getPaddingString(paddingNumber);
    let padding2ndLevel = SpecReportBeautifier.getPaddingString((paddingNumber+1)*2);

    let str = '';
    let validationErrors = specReport.getValidationErrors();

    str += padding + SpecReportBeautifier.specDescriptionToString(specReport) + '\n';

    if(specReport.isIgnored())
      str += padding2ndLevel + 'IGNORED: ' + specReport.getIgnoreReason() + '\n';
    if(!specReport.isExecutable())
      str += padding2ndLevel + 'NOT EXECUTABLE\n';

    str += SpecReportBeautifier.stringFromValidationErrors(validationErrors, (paddingNumber+1)*2);

    specReport. getRunReports().forEach((log) => {
      str += SpecReportBeautifier.specMethodReportToString(log, (paddingNumber+1)*2) + '\n';
    });

    return str;
  }

  private static specMethodReportToString(specMethodRunReport: ISpecMethodReport, paddingNumber?: number): string {
    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautifier.getPaddingString(paddingNumber);

    let str = '';
    str += padding +
      (specMethodRunReport.isSuccess() ? '' : 'FAILED : ') +
      specMethodRunReport.getMethodType() + ' ' + specMethodRunReport.getDescription() + '(' + specMethodRunReport.getMethodName()+')';

    if(specMethodRunReport.getError() != null)
      str += '\n' + padding + '         '+ specMethodRunReport.getError().message;

    return str;
  }

  static specDescriptionToString(specReport:ISpecReport):string{
    if(specReport.getSpecDescription() != null){
      return specReport.getSpecDescription() + ' (' + specReport.getSpecClassName() + ')';
    } else {
      return specReport.getSpecClassName();
    }
  }

  private static stringFromValidationErrors(errors:Array<SpecValidationError>, paddingNumber?:number):string{
    if(errors.length == 0)
      return '';

    let retStr = '';

    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautifier.getPaddingString(paddingNumber);

    retStr +=
            padding + 'INVALID: ';
    errors.forEach((error) => {
      retStr += error.message + '\n         ';
    });
    return retStr;
  }

  private static getPaddingString(paddingNumber:Number):string{
    if(paddingNumber == null) return '';
    let padding = '';
    for (let i = 0; i < paddingNumber; i++) {
      padding += SpecReportBeautifier.paddingSymb;
    }
    return padding;
  }

}
