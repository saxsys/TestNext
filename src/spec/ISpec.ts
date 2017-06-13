import {SpecMethod} from "../specRegistry/specMethod/spec-method";
import {SpecMethodType} from "../specRegistry/specMethod/spec-method-type";
export interface ISpec{
  getDescription():string
  getClassName():string;
  getClassConstructor():Function;
  getParentSpec(): ISpec;
  getNewSpecObject(): any;
  getOwnGiven(): Array<ISpecMethod>;
  getOwnGivenByName(methodName:string):ISpecMethod;
  getGiven():Array<ISpecMethod>;
  getOwnThen(): Array<ISpecMethod>;
  getOwnThenByName(methodName:string):ISpecMethod;
  getThen(): Array<ISpecMethod>;
  getOwnWhen(): ISpecMethod;
  getWhen(): ISpecMethod;
  getOwnMethods():Array<ISpecMethod>;
  getOwnMethod(methodName:string):ISpecMethod;
  isExecutableSpec():boolean;
}

export interface ISpecMethod{
  getName():string;
  getDescription():string;
  getMethodType(): SpecMethodType;
}
