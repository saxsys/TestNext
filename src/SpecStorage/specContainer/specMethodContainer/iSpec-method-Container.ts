import {SpecMethodType} from "./spec-method-type";

export interface ISpecMethodContainer{
  getName():string;
  getDescription():string;
  getMethodType(): SpecMethodType;
}
