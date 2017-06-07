import {ISpecExecutable} from "../specRegistry/specRegistryEntry/ISpec";
import {ISpecRunLogger} from "../spec-run-logger/interfaces";
import {SingleSpecRunner} from "./singleSpecRunner/single-spec-runner";
import {single} from "rxjs/operator/single";
export class MultiSpecRunner{

  private specs:Array<ISpecExecutable>;
  private logger:ISpecRunLogger;
  private singleSpecRunners = new Map<string, SingleSpecRunner>();
  private buildingErrors = new Map<ISpecExecutable, Error>();

  constructor(specRegistry:Array<ISpecExecutable>, logger:ISpecRunLogger){
    this.specs = specRegistry;
    this.logger = logger;
  }

  buildSingleSpecRunners(){
    this.specs.forEach((spec) => {
      try {
        let singleSpecRunner = new SingleSpecRunner(spec, this.logger);
        this.singleSpecRunners.set(spec.getClassName(), singleSpecRunner);
      } catch (error){
        this.buildingErrors.set(spec, error);
      }
    });
  }

  runSpecs(){
    this.singleSpecRunners.forEach((singleSpecRunner) => {
      singleSpecRunner.runSpec();
    });
  }

  getBuildingErrors():Map<ISpecExecutable, Error>{
    return this.buildingErrors;
  }
}
