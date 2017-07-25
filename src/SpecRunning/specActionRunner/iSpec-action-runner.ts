
import {ISpecAction} from "../../SpecStorage/actionContainer/iSpec-action";

export interface ISpecActionRunner{
  createActionObject():ISpecAction;
  getActionResult():any;
  executeCleanup();
  getActionClassName():string;
}
