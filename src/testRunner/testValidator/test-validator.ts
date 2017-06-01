
import {ISpecExecutable} from "../../specRegistry/specRegistryEntry/ISpec";
import {SpecValidationError} from "./spec-validation-error";


export class TestValidator {

  public static validateTest(spec:ISpecExecutable){
    if(spec.getClass() == null) throw new SpecValidationError('Class of ' + spec.getClassName() + 'is not set');
    if(spec.getWhen() == null) throw new SpecValidationError('@When of ' + spec.getClassName() + 'is not set');
    if(spec.getThenArray().length < 1) throw new SpecValidationError('There must be at lease one @Then in ' + spec.getClassName());
    if(spec.getGivenArray().length < 1) throw new SpecValidationError('There must be at lease one @Given in ' + spec.getClassName());
  };
}


