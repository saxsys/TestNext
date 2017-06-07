import {ISpecExecutable} from "../specRegistry/specRegistryEntry/ISpec";
import {ISpecRunLogger} from "../spec-run-logger/interfaces";
import {SingleSpecRunner} from "./singleSpecRunner/single-spec-runner";
export class MultiSpecRunner{

  private specs:Array<ISpecExecutable>;
  private logger:ISpecRunLogger;
  private singleSpecRunners = new Map<string, SingleSpecRunner>();

  constructor(specRegistry:Array<ISpecExecutable>, logger:ISpecRunLogger){
    this.specs = specRegistry;
    this.logger = logger;
  }

  buildSingleSpecRunners(){
    this.specs.forEach((spec) => {
      this.singleSpecRunners.set(spec.getClassName(), new SingleSpecRunner(spec, this.logger));
    });
  }

  runSpecs(){
    this.singleSpecRunners.forEach((singleSpecRunner) => {
      singleSpecRunner.runSpec();
    });
  }
}
