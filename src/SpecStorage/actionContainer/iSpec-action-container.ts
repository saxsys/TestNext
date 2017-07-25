import {SpecActionType} from "./spec-action-type";

export interface ISpecActionContainer{
  getActionClassConstructor(): any;
  getActionType(): SpecActionType;
  getActionClassName():string;
}
