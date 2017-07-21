import {ISpecActionRunner} from "./iSpec-action-runner";
import {SpecActionContainer} from "../../SpecStorage/actionContainer/action-container";
import set = Reflect.set;

export class SpecGeneralActionRunner implements  ISpecActionRunner{
  private actionContainer:SpecActionContainer;
  private actionObject;
  private returnValue;

  constructor(actionContainer:SpecActionContainer){
    this.actionContainer = actionContainer;
  }

  createActionObject(){
    this.actionObject = this.actionContainer.getNewActionObject();
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
}
