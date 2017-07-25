import {ISpecActionRunner} from "./iSpec-action-runner";
import {ISpecAction} from "../../SpecStorage/actionContainer/iSpec-action";
import {SpecActionValidator} from "../specActionValidator/spec-action-validator";
import {ISpecActionContainer} from "../../SpecStorage/actionContainer/iSpec-action-container";

export class SpecGeneralActionRunner implements  ISpecActionRunner{

  private actionContainer:ISpecActionContainer;
  private actionObject;
  private returnValue;

  /**
   * create a new Runner for a SpecGeneralAction
   * @param {SpecActionContainer} actionContainer Container of the Action which should be executed
   */
  constructor(actionContainer:ISpecActionContainer){
    this.actionContainer = actionContainer;
  }

  validateAction(){
    SpecActionValidator.validateAction(this.actionContainer);
  }

  createActionObject():ISpecAction{
    if(this.actionObject == null) {
      this.validateAction();
      let constructor = this.actionContainer.getActionClassConstructor();
      this.actionObject = new constructor;
    }
    return this.actionObject;
  }

  getActionResult():any{
    if(this.returnValue.isUndefined())
      this.executeBefore();
    return this.returnValue;
  }

  private executeBefore():any{
    //TODO implement
    let setup;
    this.returnValue = setup;

    throw Error('not Implemented');
  }

  executeCleanup(){
    //TODO implement
    throw Error('not Implemented');
  }

  getActionObject():any{
    return this.actionObject;
  }

  getActionClassName(): string {
    return this.actionContainer.getActionClassName();
  }
}
