import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecValidationError} from "../specValidator/spec-validation-error";
import {ISpecMethodContainer} from "../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {ISpecReport} from "./iSpec-report";
import {ISpecMethodRunReport} from "./iSpec-method-report";

export class SpecReportBeautifier {

  private static paddingSymb = ' ';

  public static SpecReportToString(specReport:ISpecReport, paddingNumber?: number):string{
    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautifier.getPaddingString(paddingNumber);
    let padding2ndLevel = SpecReportBeautifier.getPaddingString((paddingNumber+1)*2);

    let str = '';
    let spec = specReport.getSpec();
    let validationErrors = specReport.getValidationErrors();

    str += padding + SpecReportBeautifier.specDescriptionToString(spec) + '\n';

    if(specReport.isIgnored())
      str += padding2ndLevel + 'IGNORED: ' + specReport.getIgnoreReason() + '\n';
    if(!specReport.isExecutable())
      str += padding2ndLevel + 'NOT EXECUTABLE\n';

    str += SpecReportBeautifier.stringFromValidationErrors(validationErrors, (paddingNumber+1)*2);

    specReport. getReports().forEach((log) => {
      str += SpecReportBeautifier.specMethodReportToString(log, (paddingNumber+1)*2) + '\n';
    });

    return str;
  }

  private static specMethodReportToString(specMethodRunReport: ISpecMethodRunReport, paddingNumber?: number): string {
    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautifier.getPaddingString(paddingNumber);

    let str = '';
    str += padding + (specMethodRunReport.isSuccess() ? '' : 'FAILED : ') + SpecReportBeautifier.specMethodToString(specMethodRunReport.getSpecMethod(), 0);
    if(specMethodRunReport.getError() != null)
      str += '\n' + padding + '         '+ specMethodRunReport.getError().message;

    return str;
  }

  private static specMethodToString(specMethod: ISpecMethodContainer, paddingNumber?: number): string {
    if(paddingNumber == null) paddingNumber = 0;
    let padding = SpecReportBeautifier.getPaddingString(paddingNumber);

    return padding + specMethod.getMethodType().toString() + ' ' + specMethod.getDescription() + ' (' + specMethod.getName() + ')';
  }

  private static specDescriptionToString(spec: ISpecContainer):string{
    if(spec.getDescription() != null){
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
