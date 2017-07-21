import {ISpecAction} from "../../SpecStorage/actionContainer/iSpec-action";
import {SpecActionContainer} from "../../SpecStorage/actionContainer/action-container";
import {ISpecActionRunner} from "./iSpec-action-runner";

export class SpecActionIndividualRunner implements  ISpecActionRunner{
  private actionContainer:SpecActionContainer;
  private actionObject;


  constructor(actionContainer:SpecActionContainer){
    this.actionContainer = actionContainer;
  }

  private createActionObject(){
    this.actionObject = this.actionContainer.getNewActionObject();
  }

  getActionResult():any{
    //TODO implement
    throw Error('not Implemented');
    //return this.executeBefore()
  }

  private executeBefore():any{
    //TODO implement
    throw Error('not Implemented');
  }

  executeCleanup(){
    //TODO implement
    throw Error('not Implemented');
  }
}
