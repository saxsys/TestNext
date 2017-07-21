import {ISpecActionContainer} from "../../actionContainer/iSpec-action-container";

export interface ISpecActionList{
  addAction(propertyName:string, action:ISpecActionContainer);
  getPropertiesWithAction():Map<string, ISpecActionContainer>;
  getActions():Array<ISpecActionContainer>;
}
