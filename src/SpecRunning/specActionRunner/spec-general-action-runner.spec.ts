import {ExampleActionContainerFiller} from "../../utils/testData/example-action-container-filler";
import {SpecGeneralActionRunner} from "./spec-general-action-runner";
import {SpecActionContainer} from "../../SpecStorage/actionContainer/action-container";
import {SpecValidationError} from "../specValidator/spec-validation-error";

describe('SpecGeneralActionRunner', ()=>{

  let actionContainer = ExampleActionContainerFiller.getStandardAction();

  it('should init', ()=>{
    let actionRunner = new SpecGeneralActionRunner(actionContainer);
    expect(actionRunner).not.toBeNull();
  });
});

describe('SpecGeneralActionRunner.createActionObject', ()=>{

  let actionContainer;
  let actionRunner;

  beforeAll(()=>{
    actionContainer = ExampleActionContainerFiller.getStandardAction();
    actionRunner = new SpecGeneralActionRunner(actionContainer);
    expect(actionRunner).not.toBeNull();
  });


  it('should return an object of the Action', ()=>{
    let actionObject = actionRunner.createActionObject();
    expect(actionObject).not.toBeNull();
  });

  it('should save the Object', () =>{
    let returnedActionObject = actionRunner.createActionObject();
    let savedActionObject = actionRunner.getActionObject();

    expect(savedActionObject).not.toBeNull();
    expect(savedActionObject).toEqual(returnedActionObject);
  });

  it('should validate the Container before creating the Object', ()=>{
    let actionWithoutConstructor = new SpecActionContainer(null);
    let actionRunner = new SpecGeneralActionRunner(actionWithoutConstructor);

    expect(()=>{
      actionRunner.createActionObject();
    }).toThrowError(SpecValidationError);

  });
});
