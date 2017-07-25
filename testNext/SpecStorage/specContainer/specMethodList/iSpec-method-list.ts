import {ISpecMethodContainer} from "../specMethodContainer/iSpec-method-Container";

export interface ISpecMethodList{
  addMethod(functionName: string, description: string, execNumber: Number);
  getMethods():Array<ISpecMethodContainer>;
  getMethod(methodName:string):ISpecMethodContainer;
}
