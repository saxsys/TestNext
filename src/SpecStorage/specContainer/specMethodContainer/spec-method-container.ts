import {SpecMethodType} from "./spec-method-type";
import {ISpecMethodContainer} from "./iSpec-method-Container";

export class SpecMethodContainer implements ISpecMethodContainer{
  private name: string;
  private description: string;
  private execNumber: number;
  private methodType: SpecMethodType;

  constructor(name: string, description: string, methodType:SpecMethodType, execNumber?: number) {
    this.name = name;
    this.description = description;
    this.execNumber = execNumber;
    this.methodType = methodType;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getMethodType(): SpecMethodType{
    return this.methodType;
  }

}
