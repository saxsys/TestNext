import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecValidationError} from "./spec-validation-error";


export class SpecValidator {

  public static validate(spec: ISpecContainer){

    let specObject;

    try {
      specObject = spec.getNewSpecObject();
    } catch(error){
      throw new SpecValidationError(error.message);
    }

    if (spec.getWhen() == null)
      throw new SpecValidationError('@When of "' + spec.getClassName() + '" is not set');

    if(spec.getParentSpec() != null && spec.getOwnWhen() != null && spec.getParentSpec().getWhen() != null)
      throw new SpecValidationError('Spec "' + spec.getClassName() + '" has multiple @When functions, acquired by inheritance, this is forbidden');

    let whenMethod = specObject[spec.getWhen().getName()];
    if (whenMethod == null || typeof whenMethod != 'function')
      throw new SpecValidationError('On "' + spec.getClassName() + '" @When function "' + spec.getWhen().getName() + '" does not exist');

    if (spec.getGiven().length < 1)
      throw new SpecValidationError('There must be at lease one @Given in ' + spec.getClassName());
    spec.getGiven().forEach((specMethod) => {
      let method = specObject[specMethod.getName()];
      if (method == null || typeof method != 'function')
        throw new SpecValidationError('On "' + spec.getClassName() + '" @Given function "' + specMethod.getName() + '" does not exist');
    });

    if (spec.getThen().length < 1)
      throw new SpecValidationError('There must be at lease one @Then in ' + spec.getClassName());
    spec.getThen().forEach((specMethod) => {
      let method = specObject[specMethod.getName()];
      if (method == null || typeof method != 'function')
        throw new SpecValidationError('On "' + spec.getClassName() + '" @Then function "' + specMethod.getName() + '" does not exist');
    });
  };
}


