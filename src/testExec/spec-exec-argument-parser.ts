import {ISpecReportOutput} from "../SpecRunning/RunReportOutput/iSpec-report-output";
import {config} from "../testNext.config";

/**
 * Class to apply an argument String on the SpecReport output
 */
export class SpecExecArgumentParser{
  args:string[];


  constructor(args:string[]){
    this.args = args;
  }

  /**
   * apply the arguments on the output using the testNext.config
   * @param {ISpecReportOutput} output object of Class to generate the output
   */
  applyOnOutput(output:ISpecReportOutput){
    this.args.forEach((arg)=>{
      let runConfig = config.outputParameters[arg];
      if(runConfig == null)
        throw new Error('Argument "' + arg + '" is unknown');

      if(runConfig.param != null) {
        output[runConfig.cmd](...runConfig.param);
      } else{
        output[runConfig.cmd]();
      }
    });
  }
}
