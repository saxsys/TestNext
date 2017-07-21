import {ISpecActionList} from "./iSpec-action-list";
import {SpecRegistryError} from "../../spec-registry-error";
import {SpecActionType} from "../../actionContainer/spec-action-type";
import {ISpecActionContainer} from "../../actionContainer/iSpec-action-container";


export class SpecActionList implements ISpecActionList {
  private specActions: Map<string, ISpecActionContainer>;
  private SpecClassName:string;

  constructor(specClassName:string){
    this.SpecClassName = specClassName;
    this.specActions = new Map<string, ISpecActionContainer>();
  }

  addAction(propertyName:string, action:ISpecActionContainer){
    if(this.specActions.get(propertyName) != null)
      throw new SpecRegistryError('One Property with multiple Actions: '+ this.SpecClassName + '.' + propertyName, this.SpecClassName, propertyName);

    this.specActions.set(propertyName, action);
  }

  getPropertiesWithAction():Map<string, ISpecActionContainer>{
    return this.specActions;
  }

  getActions(): Array<ISpecActionContainer> {
    return Array.from(this.specActions.values());
  }

  getGeneralActions():Array<ISpecActionContainer>{
    let generalActions = [];
    this.specActions.forEach((actionContainer)=>{
      if(actionContainer.getActionType() == SpecActionType.GENERAL)
        generalActions.push(actionContainer);
    });

    return generalActions;
  }

  getIndividualActions():Array<ISpecActionContainer>{
    let individualActions = [];
    this.specActions.forEach((actionContainer)=>{
      if(actionContainer.getActionType() == SpecActionType.INDIVIDUAL)
      individualActions.push(actionContainer);
    });

    return individualActions;
  }
}
