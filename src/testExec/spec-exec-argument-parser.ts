import {ISpecReportOutput} from "../SpecRunning/RunReportOutput/iSpec-report-output";
import {config} from "../testNext.config";

export class SpecExecArgumentParser{
  args:string[];


  constructor(args:string[]){
    this.args = args;
  }

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
