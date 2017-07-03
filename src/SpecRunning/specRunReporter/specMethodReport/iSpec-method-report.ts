import {ISpecMethodContainer} from "../../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecMethodType} from "../../../SpecStorage/specContainer/specMethodContainer/spec-method-type";

export interface ISpecMethodRunReport {
  getSpecMethod():ISpecMethodContainer;
  getMethodName(): string;
  getMethodType(): SpecMethodType;
  getDescription(): string;
  isSuccess(): boolean
  getError(): Error;
}
