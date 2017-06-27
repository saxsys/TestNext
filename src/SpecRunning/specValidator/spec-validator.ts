import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecValidationError} from "./spec-validation-error";


export class SpecValidator {

  public static validate(specContainer: ISpecContainer) {

    let specObject;

    try {
      specObject = specContainer.getNewSpecObject();
    } catch (error) {
      throw new SpecValidationError(error.message);
    }


    SpecValidator.validateWhenOf(specContainer, specObject);
    SpecValidator.validateGivenOf(specContainer, specObject);
    SpecValidator.validateThensOf(specContainer, specObject);

  }

  private static validateGivenOf(specContainer: ISpecContainer, specObject: any) {
    //must have Given
    if (specContainer.getGiven().length < 1)
      throw new SpecValidationError('There must be at lease one @Given in ' + specContainer.getClassName());

    //methods must exist
    specContainer.getGiven().forEach((specMethod) => {
      let method = specObject[specMethod.getName()];
      if (method == null || typeof method != 'function')
        throw new SpecValidationError('On "' + specContainer.getClassName() + '" @Given function "' + specMethod.getName() + '" does not exist');
      if(method.length > 0)
        throw new SpecValidationError('@Given "' + specContainer.getClassName() + '.' + specMethod.getName() + '" has constructor Arguments, this is forbidden');
    });
  }

  private static validateWhenOf(specContainer: ISpecContainer, specObject: any) {
    //must have When
    if (specContainer.getWhen() == null)
      throw new SpecValidationError('@When of "' + specContainer.getClassName() + '" is not set');
    //when must exist
    let whenMethod = specObject[specContainer.getWhen().getName()];
    if (whenMethod == null || typeof whenMethod != 'function')
      throw new SpecValidationError('On "' + specContainer.getClassName() + '" @When function "' + specContainer.getWhen().getName() + '" does not exist');
    if(whenMethod.length > 0)
      throw new SpecValidationError('@When "' + specContainer.getClassName() + '.' + specContainer.getWhen().getName() + '" has constructor Arguments, this is forbidden');
  }

  private static validateThensOf(specContainer: ISpecContainer, specObject: any) {
    if (specContainer.getThen().length > 0 && specContainer.getThenThrow() != null) {
      throw new SpecValidationError('Spec "' + specContainer.getClassName() + '" has @Then and @ThenThrow, only one can be executed ')
    } else if (specContainer.getThen().length > 0) {
      SpecValidator.validateThenOf(specContainer, specObject)
    } else if (specContainer.getThenThrow() != null) {
      SpecValidator.validateThenThrowOf(specContainer, specObject);
    } else {
      throw new SpecValidationError(
        'There must be at lease one @Then or a @ThenThrow in ' + specContainer.getClassName()
      );
    }
  }

  private static validateThenOf(specContainer: ISpecContainer, specObject: any) {
    //methods must exist
    specContainer.getThen().forEach((specMethod) => {
      let method = specObject[specMethod.getName()];
      if (method == null || typeof method != 'function')
        throw new SpecValidationError('On "' + specContainer.getClassName() + '" @Then function "' + specMethod.getName() + '" does not exist');
      if(method.length > 0)
        throw new SpecValidationError('@Then "' + specContainer.getClassName() + '.' + specMethod.getName() + '" has constructor Arguments, this is forbidden');
    });
  }

  private static validateThenThrowOf(specContainer:ISpecContainer, specObject: any){
    let method = specObject[specContainer.getThenThrow().getName()];
    if (method == null || typeof method != 'function')
      throw new SpecValidationError('On "' + specContainer.getClassName() + '" @Then function "' + specContainer.getThenThrow().getName() + '" does not exist');
    if(method.length > 0)
      throw new SpecValidationError('@ThenThrow "' + specContainer.getClassName() + '.' + specContainer.getThenThrow().getName() + '" has constructor Arguments, this is forbidden');
  }

}



