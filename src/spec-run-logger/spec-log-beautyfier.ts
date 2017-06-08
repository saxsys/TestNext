import {ISpecRunLog, ISpecMethodRunLog} from "./interfaces";
import {ISpecExecutable, ISpecMethod} from "../specRegistry/specRegistryEntry/ISpec";
export class SuccessLogBeautyfier {

  private static paddingSymb = ' ';

  public static specMethodLogToString(specMethodLog: ISpecMethodRunLog, paddingNumber?: number): string {
    if(paddingNumber == null) paddingNumber = 0;
    let padding = '';
    for (let i = 0; i < paddingNumber; i++) {
      padding += SuccessLogBeautyfier.paddingSymb;
    }

    let str = '';
    str += padding + (specMethodLog.isSuccess() ? 'SUCCESS: ' : 'FAILED : ') + SuccessLogBeautyfier.specMethodToString(specMethodLog.getSpecMethod(), 0);
    if(specMethodLog.getError() != null)
      str += '\n' + padding + '         '+ specMethodLog.getError().message;

    return str;
  }


  public static specMethodToString(specMethod: ISpecMethod, paddingNumber?: number): string {
    if(paddingNumber == null) paddingNumber = 0;
    let padding = '';
    for (let i = 0; i < paddingNumber; i++) {
      padding += SuccessLogBeautyfier.paddingSymb;
    }

    return padding + specMethod.getMethodType().toString() + ' ' + specMethod.getDescription() + ' (' + specMethod.getName() + ')';
  }

  public static SpecLogToString(specLog:ISpecRunLog, paddingNumber?: number):string{
    if(paddingNumber == null) paddingNumber = 0;
    let padding = '';
    for (let i = 0; i < paddingNumber; i++) {
      padding += SuccessLogBeautyfier.paddingSymb;
    }

    let str = '';

    let spec = specLog.getSpec();
    if(spec.getDescription() !== ''){
      str += padding + spec.getDescription() + ' (' + spec.getClassName() + ')\n';
    } else {
      str += padding + spec.getClassName() + '\n';
    }
    specLog.getLogs().forEach((log) => {
      str += SuccessLogBeautyfier.specMethodLogToString(log, (paddingNumber+1)*2) + '\n';
    });

    return str;
  }

}
