import {ISpecActionContainer} from "./iSpec-action-container";
import {SpecActionType} from "./spec-action-type";

export class SpecActionContainer implements ISpecActionContainer {

  private actionType: SpecActionType;
  private actionClassConstructor: any;

  constructor(actionClassConstructor: Function) {
    this.actionClassConstructor = actionClassConstructor;
  }


  setActionType(actionType: SpecActionType) {
    this.actionType = actionType;
  }


  getActionClassConstructor(): any {
    return this.actionClassConstructor;
  }

  getActionType(): SpecActionType {
    return this.actionType;
  }

  getActionClassName(): string {
    return this.actionClassConstructor.name;
  }

}
