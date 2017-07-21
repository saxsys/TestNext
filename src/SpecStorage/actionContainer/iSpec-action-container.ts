import {ISpecAction} from "./iSpec-action";
import {SpecActionType} from "./spec-action-type";

export interface ISpecActionContainer{
  getActionClassConstructor(): Function;
  getActionType(): SpecActionType;
  getNewActionObject(): ISpecAction;
}
