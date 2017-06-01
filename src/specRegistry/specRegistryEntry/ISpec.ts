import {TestMethodRegistryEntry} from "../testMethodRegistryEntry/testMethod-registry-entry";
import {SpecMethodType} from "../testMethodRegistryEntry/spec-method-type";
export interface ISpecExecutable{
  getSpecName():string;
  getClassName():string;
  getClass():any;
  getGivenArray(): Array<ISpecMethod>;
  getThenArray(): Array<ISpecMethod>;
  getWhen(): ISpecMethod;
}

export interface ISpecMethod{
  getName():string;
  getDescription():string;
  getMethodType(): SpecMethodType;
}
