import {ISpecExecutable} from "../../specRegistry/specRegistryEntry/ISpec";
import {SpecValidationError} from "./spec-validation-error";


export class TestValidator {

  public static validate(spec: ISpecExecutable){

    let specObject;

    try {
      specObject = spec.getNewSpecObject();
    } catch(error){
      throw new SpecValidationError(error.message);
    }
    if (spec.getWhen() == null)
      throw new SpecValidationError('@When of ' + spec.getClassName() + 'is not set');
    let whenMethod = specObject[spec.getWhen().getName()];
    if (whenMethod == null || typeof whenMethod != 'function')
      throw new SpecValidationError('On "' + spec.getClassName() + '" @When function "' + spec.getWhen().getName() + '" does not exist');

    if (spec.getGivenArray().length < 1)
      throw new SpecValidationError('There must be at lease one @Given in ' + spec.getClassName());
    spec.getGivenArray().forEach((specMethod) => {
      let method = specObject[specMethod.getName()];
      if (method == null || typeof method != 'function')
        throw new SpecValidationError('On "' + spec.getClassName() + '" @Given function "' + specMethod.getName() + '" does not exist');
    });

    if (spec.getThenArray().length < 1)
      throw new SpecValidationError('There must be at lease one @Then in ' + spec.getClassName());
    spec.getThenArray().forEach((specMethod) => {
      let method = specObject[specMethod.getName()];
      if (method == null || typeof method != 'function')
        throw new SpecValidationError('On "' + spec.getClassName() + '" @Then function "' + specMethod.getName() + '" does not exist');
    });
  };
}


