import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
/**
 * Class collecting multiple Specs and necessary Action, which should be executed
 */
export class SpecSuiteRunner{

  specs:Array<ISpecContainer>

  constructor(specs:Array<ISpecContainer>){
    this.specs = specs;
  }
}
