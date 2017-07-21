import {SpecActionContainer} from "../../SpecStorage/actionContainer/action-container";
export class ExampleActionContainerFiller{
  static getStandardAction(){
    class StandardAction{

    }
    let actionConstructor = StandardAction.prototype.constructor;

    let actionContainer = new SpecActionContainer(actionConstructor);

    return actionContainer;
  }
}
