import {SpecActionContainer} from "../../SpecStorage/actionContainer/action-container";
import {SpecActionValidator} from "./spec-action-validator";
import {SpecValidationError} from "../specValidator/spec-validation-error";

describe('SpecActionValidator.validateAction', ()=>{
  it('should refuse Objects, where no constructor is null', ()=>{
    let actionWithoutConstructor = new SpecActionContainer(null);
    expect(()=>{
      SpecActionValidator.validateAction(actionWithoutConstructor);
    }).toThrowError(SpecValidationError, 'SpecActionContainer invalid, no Class Constructor set');
  });
});
