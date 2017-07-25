import {ISpecActionContainer} from "../../SpecStorage/actionContainer/iSpec-action-container";
import {SpecValidationError} from "../specValidator/spec-validation-error";

export class SpecActionValidator{
  static validateAction(actionContainer:ISpecActionContainer){
    if(actionContainer.getActionClassConstructor() == null)
      throw new SpecValidationError('SpecActionContainer invalid, no Class Constructor set');
  }
}
