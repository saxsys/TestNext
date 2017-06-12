import {TestMethodRegistryEntry} from "../testMethodRegistryEntry/testMethod-registry-entry";
import {SpecMethodType} from "../testMethodRegistryEntry/spec-method-type";
export interface ISpecExecutable{
  getDescription():string
  getClassName():string;
  getClassConstructor():Function;
  getNewSpecObject(): any;
  getGivenArray(): Array<ISpecMethod>;
  getGiven(methodName:string):ISpecMethod;
  getThenArray(): Array<ISpecMethod>;
  getThen(methodName:string):ISpecMethod;
  getWhen(): ISpecMethod;
  getMethods():Array<ISpecMethod>;
  getMethod(methodName:string):ISpecMethod;


}

export interface ISpecMethod{
  getName():string;
  getDescription():string;
  getMethodType(): SpecMethodType;
}
